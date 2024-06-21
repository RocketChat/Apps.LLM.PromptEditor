// DB Interactions 
/* 
1. Fetching all the LLM models from the database (admin)
2. Performing CRUD operations on LLM model (admin)
3. Fetching the conversations of a user with LLM models (last 5 and all both)
4. creating a conversation with LLM.
5. updating the conversation (making it public/private)
6. deleting the converation (user can only delete it's own conversation only)
7. Fetching the messages of a conversation.
*/

// DB Schema 

// LLM Model Structure
const LLM_STRUCTURE = 
{
    association : {
        model : 'misc',
        id : 'app_id'
    },
    data : {
        id : "llm_rand()", // random unique id
        name : "LLAMA", // example
        ...LLM_DATA
    }
}

const CONVERSATION = 
{
    association : {
        model : 'user',
        id : 'user_id'
    },
    data : {
        conversations : [{
            conversation_id : "conv123",
            title : "How can I build a compiler", // example
            sharing_mode : ['PUBLIC', 'PRIVATE' ] // This is going to be enum
        }], // array of convesations
    }
}

const MESSAGE = 
{
    association : {
        model : 'message',
        id : 'conversation_id'
    },
    data : {
        creator : "use_id",
        llm_model : 'llm_model_id',
        messages : [{
            order_id : "1/2/3", // TO get messages in order
            message : "Message ",
            sent_by : ["user",'llm'], // This is going to be enum,
            created_at : "2020-01-01 00:00:00",
            updated_at : "2020-01-01 00:00:00",
        }], // array of messages
        message_id : "message_id" // random_id
    }
}


[
    {
        id : "llmRand()", // random unique id
        name : "MISTRAL", // unique identifier
        model: "mistral", // required to call API
    },
    {
        data : {
            id : "llmRand()", // random unique id
            name : "LLAMA", // unique identifier
            model: "mistral", // required to call API
        }
    }
]


[
    {
        conversation : {
            conversation_id : "conv123",
            title : "How can I build a compiler conv", // example
            sharing_mode :'PRIVATE' // This is going to be enum
        }
    },
    {
        group : [
            groupName: "groupName_1",
            conversations: [
                {
                    conversation_id : "conv1234",
                    title : "How can I build a compiler conv", // example
                    sharing_mode :'PUBLIC' // This is going to be enum
                }
            ]
        ]
    }
]


{
    conversation : {
        conversation_id : "conv123",
        title : "How can I build a compiler", // example
        sharing_mode : ['PUBLIC', 'PRIVATE' ] // This is going to be enum
    },
    conv: {
    ...convDat
    },
    group:[
        groupName: "name",
        conversations: [
            {
                "conv": {
                    ...convDat
                }
            },
            {
                "conv": {
                    ...convDat
                }
            }
        ]
    ],
    conv: {
    ...convDat
    }
}

[{
    messageId : "msg_123",
    message : "Hey, how are you LLama?",
    sentBy : "user",
    createdAt : "2020-01-01 00:00:00",
    updatedAt : "2020-01-01 00:00:00",
},
{
    messageId : "msg_234",
    message : "I am good how about you?",
    sentBy : 'llm',
    createdAt : "2020-01-01 00:00:00",
    updatedAt : "2020-01-01 00:00:00",  
}]

