import type { types } from '~~/utils/types'

export function useDeta() {
    const idb = useIDB()
    const client = useClient()
    const isDetaEnabled = ref(true)

    const deta = {
        conversation: {
            async get(id: string) {
                return {
                    key: '',
                    title: '',
                    updatedAt: Date.now(),
                    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
                    messages: [],
                }
            },
            async create(conversation: types.Conversation) {
                return {
                    key: '',
                    title: '',
                    updatedAt: Date.now(),
                    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
                    messages: [],
                }
                logger.info('Creating conversation', conversation)
                return await client.deta.conversations.create.mutate(conversation)
            },
            async update(conversation: types.Conversation) {
                return {
                    key: '',
                    title: '',
                    updatedAt: Date.now(),
                    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
                    messages: [],
                }
            },
            async delete(id: string) {
                return true
            },
            async list() {
                return [
                    {
                        key: '',
                        title: '',
                        updatedAt: Date.now(),
                        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
                        messages: [],
                    },
                ]
            },
            async sync(id: string) {
                return true
            },
        },
        message: {
            async get(id: string) {
                return {
                    id,
                    conversationId: 'testConv',
                    text: 'Hey there!',
                    updatedAt: Date.now(),
                    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
                }
            },
            async create(message: types.Message) {
                return {
                    id: 'id',
                    conversationId: 'testConv',
                    text: 'Hey there! wssup',
                    updatedAt: Date.now(),
                    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
                }
            },
            update: async (message: types.Message) => {
                return message
            },
            delete: async (id: string) => {
                return true
            },
        },
    }

    return {
        isDetaEnabled,
        deta,
    }
}

type DetaErrorCode = 'NOT_FOUND' | null

export class DetaError extends Error {
    code: DetaErrorCode = null
    constructor(message: string, code: DetaErrorCode) {
        super(message)
        this.code = code
    }
}
