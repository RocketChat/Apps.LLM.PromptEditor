import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
    const { accessToken } = await readBody(event)
    setCookie(event, 'ungpt-session', accessToken, {})

    return accessToken
})
