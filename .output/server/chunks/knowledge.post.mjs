import { defineEventHandler, readBody } from 'h3';
import openai from 'openai';
import pLimit from 'p-limit';
import stream from 'node:stream';
import Crawler from 'crawler';
import { NodeHtmlMarkdown } from 'node-html-markdown';

function splitMarkdownByHeadingLevel(content, level) {
  const headingRegex = new RegExp(`^#{${level}} `, "gm");
  const sections = content.split(headingRegex).filter(Boolean).map((section) => section.trim());
  return sections;
}

const createOpenAIClient = () => {
  const config = new openai.Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });
  return new openai.OpenAIApi(config);
};
const createEmbedding = async (content) => {
  const client = createOpenAIClient();
  const embedding = await client.createEmbedding({
    model: "text-embedding-ada-002",
    input: content
  });
  return embedding.data.data[0].embedding;
};
async function indexDocuments(documentList) {
  const documentsWithSections = await Promise.all(
    documentList.map(async (document) => ({
      ...document,
      // Split markdown into sections of ## headings
      sections: splitMarkdownByHeadingLevel(document.content, 3),
      fullEmbedding: await createEmbedding(document.content)
    }))
  );
  const sections = documentsWithSections.reduce((acc, val) => {
    const sectionList = val.sections.map((section) => {
      const { sections: _, content: __, ...file } = val;
      return { ...file, section };
    });
    return [...acc, ...sectionList];
  }, []);
  const limit = pLimit(20);
  const fileEmbeddingsFetch = sections.map((section) => limit(async () => {
    const embedding = await createEmbedding(section.section);
    return { ...section, embedding };
  }));
  const embeddings = await Promise.all(fileEmbeddingsFetch);
  return embeddings;
}

const nhm = new NodeHtmlMarkdown();
function extractContentAndLinks($) {
  try {
    const title = $("title").text();
    const favicon = $('link[rel="icon"]').attr("href");
    const allowedTags = ["p", "h1", "h2", "h3", "h4", "h5", "h6", "pre", "code"];
    const filteredHtml = $("*").filter((i, el) => el.type === "tag" && allowedTags.includes(el.tagName)).map((i, el) => $.html(el)).get().join("");
    const markdown = nhm.translate(filteredHtml);
    const markdownClean = markdown.replace(/!\[.*\]\(.*\)/g, "").replace(/^(?!#).*/g, "").replace(/#{1,6} \[.*\]\(.*\)/g, "").replace(/#{1,6} ?\n/g, "").split("\n").map((line) => line.trim()).filter(Boolean).join("\n");
    const links = $("a").filter((i, el) => {
      const href = $(el).attr("href");
      return Boolean((href == null ? void 0 : href.startsWith("/")) && !href.startsWith("//"));
    }).map((i, el) => $(el).attr("href")).toArray().map((link) => link.replace(/[#\?].+/g, ""));
    return { markdown: markdownClean, links, favicon, title };
  } catch (error) {
    console.log(error);
    return { markdown: "", links: [] };
  }
}
function normalizeLinkList(links, baseUrl) {
  return links.map((link) => {
    const baseUrlWithoutParts = baseUrl.split("/").slice(0, 3).join("/");
    const completeLink = link.startsWith("http") ? link : baseUrlWithoutParts + link;
    const normalizedLink = completeLink.replace(/([^:]\/)\/+/g, "$1").replace(/\/$/, "");
    return normalizedLink;
  }).filter((link) => link.startsWith(baseUrl));
}
function WebScraper(url, options) {
  const readable = new stream.Readable({
    objectMode: true,
    read() {
    }
  });
  const visited = /* @__PURE__ */ new Set();
  const c = new Crawler({
    maxConnections: (options == null ? void 0 : options.maxConnections) || 5,
    callback(error, res, done) {
      if (error) {
        console.log(error);
      } else {
        console.log("Crawling", res.request.uri.href);
        const { $, request } = res;
        const { markdown, links, favicon, title } = extractContentAndLinks($);
        const result = { url: request.uri.href, markdown, favicon, title };
        readable.push(result);
        if (options == null ? void 0 : options.crawl) {
          const normalizedLinks = normalizeLinkList(links, url);
          normalizedLinks.forEach((link) => {
            if (!visited.has(link)) {
              visited.add(link);
              c.queue(link);
            }
          });
        }
      }
      done();
    }
  });
  c.queue(url);
  c.on("drain", () => {
    readable.emit("end");
  });
  return readable;
}
async function scrapeUrl(url) {
  return new Promise((resolve, reject) => {
    const readable = WebScraper(url);
    let result;
    readable.on("data", (data) => {
      result = data;
    });
    readable.on("end", () => {
      resolve(result);
    });
    readable.on("error", (error) => {
      reject(error);
    });
  });
}

const knowledge_post = defineEventHandler(async (event) => {
  const payload = await readBody(event);
  if (payload.type === "url") {
    const { url, embeddings } = payload;
    if (!url) {
      throw new Error("No URL provided");
    }
    const { markdown, favicon, title } = await scrapeUrl(url);
    if (embeddings) {
      return await indexDocuments([{
        url,
        content: markdown
      }]);
    }
    return { markdown, favicon, title };
  }
});

export { knowledge_post as default };
//# sourceMappingURL=knowledge.post.mjs.map
