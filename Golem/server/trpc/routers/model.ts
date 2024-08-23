import { z } from 'zod'
import { encoding_for_model } from '@dqbd/tiktoken'
import { publicProcedure, router } from '~/server/trpc/trpc'

export const modelRouter = router({
    getTokenCount: publicProcedure
        .input(z.string())
        .mutation(async ({ input }) => {
            const encoding = encoding_for_model('llama3-8b')
            return encoding.encode(input).length
        }),
})

export type ModelRouter = typeof modelRouter
