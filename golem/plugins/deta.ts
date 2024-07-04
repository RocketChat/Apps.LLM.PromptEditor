export default defineNuxtPlugin(async () => {
    if (process.client) {
        const isDetaEnabled = ref(false)
        // const client = useClient()
        // isDetaEnabled.value = await client.deta.info.isEnabled.query()

        // if (isDetaEnabled.value) {
        //     const { instanceApiKey, apiKey } = useSettings()
        //     const detaApiKey = await client.deta.preferences.get.query('api-key') as string
        //     if (detaApiKey) {
        //         instanceApiKey.value = detaApiKey
        //         apiKey.value = detaApiKey
        //     }

        //     const { setPalette } = useAppearance()
        //     const color = await client.deta.preferences.get.query('color') as string
        //     if (color) {
        //         setPalette(color)
        //     }
        // }
    }
    else {
        const isDetaEnabled = ref(false)
    }
})
