import { router } from '../trpc'
import { authRouter } from './auth'
import { detaInfoRouter } from './deta'
import { conversationRouter } from './deta/conversation'
import { messageRouter } from './deta/message'
import { preferencesRouter } from './deta/preferences'
import { modelRouter } from './model'
export const appRouter = router({
    deta: router({
        conversations: conversationRouter,
        messages: messageRouter,
        info: detaInfoRouter,
        preferences: preferencesRouter,
    }),
    model: modelRouter,
    auth: authRouter,
})
// export type definition of API
export type AppRouter = typeof appRouter
