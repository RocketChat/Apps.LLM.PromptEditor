# [LLM Prompt Editor App](https://github.com/RocketChat/Apps.Emoji.Embellisher) for [Rocket.Chat](https://rocket.chat/)

# Project Overview and Goals
## Overview
This project was developed during GSoC 2024 and involved the creation of a Rocket.Chat app called LLM Prompt Editor. The app integrates Golem, a prompt editor, with Rocket.Chat's in-house AI models to provide advanced prompt editing and AI inference capabilities directly within Rocket.Chat.

## Goals
1. **Create a Prompt Editor**: Develop an LLP (Large Language Model) prompt editor using Golem.
2. **Decouple Inference Functionality**: Replace Golem's existing OpenAPI inference with Rocket.Chat’s in-house AI models.
3. **Support Streaming**: Implement concurrent streaming of responses across multiple devices.
4. **Integrate with Rocket.Chat**: Bundle the Golem editor and serve it through a Rocket.Chat app.
5. **API Endpoints**: Develop API endpoints in the app to serve the Golem build.
6. **Data Persistence**: Store chat history in Rocket.Chat's MongoDB for future inference.
7. **Conversation History API**: Provide an endpoint for Golem's frontend to request conversation history.
8. **App Commands**: Create Rocket.Chat app commands to initiate workflows from the main Rocket.Chat instance.

## Challenges Faced
### 1. Decoupling Inference
The process of decoupling Golem's behavior from OpenAPI inference was complex due to the numerous hooks involved.

### 2. Fetching and Rendering Data
Similarly, fetching and rendering conversation data posed challenges due to the hooks.

### 3. Vite Packaging Issues
Golem used Vite for packaging, which by default splits JavaScript into multiple files. For this project, it was crucial to minimize the number of files, requiring significant adjustments.

## Demo Video
The demo includes a video showcasing the following features:

https://github.com/user-attachments/assets/ffae49c9-caa5-40a3-bd31-4ddd93f52a80

### Concurrency and Streaming
Demonstration of how the app supports concurrent streaming of responses through Golem rendered via the Rocket.Chat app.

### Steps Demonstrated
#### 1. Initiating a Prompt
How to start a prompt editing session using the LLM Prompt Editor in Rocket.Chat.

#### 2. Streaming Responses
Visualization of how responses are streamed and handled concurrently across different devices.

#### 3. Saving and Fetching Conversation History
Demonstration of how chat history is saved in MongoDB and how it can be retrieved for future use.

#### 4. Using App Commands
Explanation of how to use the custom Rocket.Chat app commands to interact with the LLM Prompt Editor.

## Future Enhancements
### 1. Improving Hook Management
Continued efforts to streamline the handling of hooks in Golem.

### 2. Enhanced Packaging
Further optimization of the Vite packaging process to suit the app’s needs.

## 🤝 Appreciations
Here to expresses my sincere gratitude to my mentors and provide my profile details for networking

### ✨ Gratitude to Mentors
I would like to express my sincere gratitude to my amazing mentors Gabriel Engel, Sing Li, John Crisp and Shubham Bhardwaj, for their invaluable guidance and support throughout my GSoC'24 journey 🚀. Their constant encouragement, technical expertise, and willingness to help have been instrumental in the success of this project. I feel incredibly fortunate to have had the opportunity to learn from such talented individuals. 🌟

I would also like to extend a heartfelt thank you to the entire Rocket.Chat developer community for their openness and support throughout the development process. Thank you both for your mentorship and for inspiring me to learn and grow beyond GSoC. 🙏
