import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isProduction = false;
const app = express();
const port = process.env.PORT || 4000;
//
console.log('Production Mode: ', isProduction);
async function createServer() {
	if (isProduction) {
		app.use(express.static(path.join(__dirname, '.output')));
		// Handles any requests that don't match the ones above by sending back the index.html file
		app.get('*', (req, res) => {
			res.sendFile(path.join(__dirname + '/dist/index.html'));
		});
	} else {
		const vite = await createViteServer({
			server: { middlewareMode: true },
			appType: 'custom',
		});

		app.use(vite.middlewares);
		app.use('*', async (req, res, next) => {
			const url = req.originalUrl;

			try {
				// 1. Read index.html
				let template = fs.readFileSync(
					path.resolve(__dirname, 'index.html'),
					'utf-8'
				);

				// 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
				//    also applies HTML transforms from Vite plugins, e.g. global preambles
				//    from @vitejs/plugin-react
				template = await vite.transformIndexHtml(url, template);

				// 3. Load the server entry. vite.ssrLoadModule automatically transforms
				//    your ESM source code to be usable in Node.js! There is no bundling
				//    required, and provides efficient invalidation similar to HMR.
				const { render } = await vite.ssrLoadModule('/src/entry-server.jsx');

				// 4. render the app HTML. This assumes entry-server.js's exported `render`
				//    function calls appropriate framework SSR APIs,
				//    e.g. ReactDOMServer.renderToString()
				const appHtml = await render(url);

				// 5. Inject the app-rendered HTML into the template.
				const html = template.replace(`<!--app-html-->`, appHtml);

				// 6. Send the rendered HTML back.
				res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
			} catch (e) {
				// If an error is caught, let Vite fix the stack trace so it maps back to
				// your actual source code.
				vite.ssrFixStacktrace(e);
				next(e);
			}
		});
	}
}

createServer().then(() => {
	app.listen(port, () => console.log(`Server is listening on port ${port}`));
});
//
