import { defineEventHandler, readBody, setCookie } from 'h3';

const login_post = defineEventHandler(async (event) => {
  const { accessToken } = await readBody(event);
  setCookie(event, "ungpt-session", accessToken, {});
  return accessToken;
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
