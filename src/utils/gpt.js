import axios from "axios";
const openai = axios.create({
    baseURL: "https://api.openai.com/v1",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('gptAPIKey')}`,
    },
});

async function createChatCompletion(
    messages,
    options
) {
    try {
        console.log("Creating chat completion...");
        const response = await openai.post("/chat/completions", {
            // model: options.model,
            messages,
            ...options,
        });
        console.log("Chat completion created.");

        return response.data.choices;
    } catch (error) {
        console.error("Error creating chat completion:", error);
    }
}
async function gpt(
    chat=[{
        role: "system",
        content: "Hello, I'm a chatbot. How can I help you?"
      }],
) {
    const options = {
        temperature: 0.7,
        max_tokens: 300,
        model: "gpt-3.5-turbo" 
    };
    console.log("Chat::", chat);

    const choices = await createChatCompletion(chat, options);
    try {
        if (choices[0].message.content) {
            console.log("Chatbot response:", choices[0].message.content);
            return [...chat, {
                role: "assistant",
                content: choices[0].message.content,
            }];
        } else {
            return [...chat, {
                role: "assistant",
                content: "Sorry, I didn't get that. Can you try again?",
            }];
        }
    } catch (error) {
        console.error("Error creating chat completion:", error);
        return [...chat, {
            role: "assistant",
            content: "Api key is not valid",
        }];
    }
}

export default gpt;
