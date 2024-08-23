import { Configuration, OpenAIApi } from 'openai'
import type { NitroFetchOptions } from 'nitropack'
import { nanoid } from 'nanoid'
import { streamOpenAIResponse } from '~~/utils/fetch-sse'

export function useLanguageModel() {
    const { apiKey, modelUsed, maxTokens } = useSettings()

    async function complete(prompt: string, params?: LMCompleteParams) {
        const client = new OpenAIApi(new Configuration({
            apiKey: apiKey.value || '',
        }))

        const additionalParams = {
            temperature: params?.temperature || 0.8,
            max_tokens: params?.maxTokens || 256,
            stop: params?.stop,
        }

        const response = await client.createChatCompletion({
            model: 'llama3-8b',
            messages: [{
                role: 'system',
                content: params?.systemMessage || 'This is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.',
            }, {
                role: 'user',
                content: prompt,
            }],
            ...additionalParams,
        })

        return response.data.choices[0].message?.content
    }
    function generateRandomId(length = 16) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
    
        return result;
    }
    
    // Example usage
    const randomId = generateRandomId(16); // Generates a random ID of length 16
    console.log(randomId);
    
    async function sendMessage(options: any) {
        const { onProgress, signal, convId, ...requestBody } = options

        const result = {
            role: 'assistant',
            id: nanoid(),
            text: '',
            delta: undefined,
            detail: undefined,
            parentMessageId: '',
        }

        console.log({convId});


        const getCookie = (name) => {
            let cookieArr = document.cookie.split(";"); // Split the cookies string into individual cookie strings
            for (let i = 0; i < cookieArr.length; i++) {
            let cookiePair = cookieArr[i].split("="); // Split each individual cookie string into name and value
            let cookieName = cookiePair[0].trim(); // Trim any leading spaces
            if (cookieName === name) {
                return decodeURIComponent(cookiePair[1]); // Return the value of the cookie
            }
            }
            return null; // Return null if the cookie was not found
        };

        while (true) {
            const messageSend = requestBody.messages[requestBody.messages.length - 1].content
            const resp = await fetch(
                "http://localhost:3000/api/apps/public/8d4acc61-d871-46e2-94b5-db161448483c/conversate",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-User-Id": getCookie("rc_uid"),
                        "X-Auth-Token": getCookie("rc_token"),
                    },
                    body: JSON.stringify({
                        message: messageSend,
                        conversationId: convId,
                        messageId : result.id,
                        modelUsed: modelUsed,
                        maxTokens
                    }),
                }
            );
            // const resp = await fetch(
            //     "http://localhost:3000/api/apps/public/8d4acc61-d871-46e2-94b5-db161448483c/conversate",
            //     {
            //         method: "POST",
            //         headers: {
            //             "Content-Type": "application/json",
            //             "X-User-Id": getCookie("rc_uid"),
            //             "X-Auth-Token": getCookie("rc_token"),
            //         },
            //         body: JSON.stringify({
            //             message: messageSend,
            //             conversationId: result.id,
            //         }),
            //     }
            // );

            const data = await resp.json()

            console.log({data})

            if (data.message.includes('%ended%')) {
                const stripped = data.message.replace('%ended%', '')
                await onProgress({...result, text : stripped})
                break
            }
            else {
                await onProgress({...result, text : data.message})
            }
        }

        return result

        // if (!requestBody.stream) {
        //     if (response.id) {
        //         result.id = response.id
        //     }
        //     const message = response.choices[0].message
        //     if (!message) {
        //         throw new Error('No message in response')
        //     }
        //     result.text = message.content
        //     if (message.role) {
        //         result.role = message.role
        //     }
        //     result.detail = response as any
        //     console.log(result)
        //     return result
        // }
        // else {
        //     for await (const data of streamOpenAIResponse(response)) {
        //         if (data.id) {
        //             result.id = data.id
        //         }
        //         if (data?.choices?.length) {
        //             const delta = data.choices[0].delta
        //             result.delta = delta.content
        //             if (delta?.content) {
        //                 result.text += delta.content
        //             }
        //             result.detail = data
        //             if (delta.role) {
        //                 result.role = delta.role
        //             }
        //         }
        //         if (onProgress) {
        //             await onProgress(result)
        //         }
        //     }
        //     return result
        // }
    }

    const checkIfAPIKeyIsValid = async (newApiKey: string) => {
        const res = await $fetch<any>('https://api.openai.com/v1/engines', {
            headers: {
                Authorization: `Bearer ${newApiKey || apiKey.value}`,
            },
        })
        if (res.status === 401) {
            throw new Error('Invalid API key')
        }
    }

    return { complete, sendMessage, checkIfAPIKeyIsValid }
}

interface LMCompleteParams {
    temperature?: number
    maxTokens?: number
    stop?: string
    systemMessage?: string
}
