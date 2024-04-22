// chatService.js
const OpenAI = require('openai');

class ChatService {
  async ask(question) {
    throw new Error("This method should be implemented by subclasses");
  }
}

class OpenAIChatService extends ChatService {
  constructor(apiKey) {
    super();  // Calling the parent class constructor
    this.openai = new OpenAI({ apiKey });
  }

//   async ask(question) {
//     try {
//         // const prompt = `Respond with restaurant recommendations directly in the following format: Restaurant Name; Address. Given: "${question}"`;
//         // const completion = await this.openai.chat.completions.create({
//         //     model: "gpt-3.5-turbo",
//         //     messages: [
//         //         { role: "system", content: prompt }
//         //     ],
//         // });
//         const prompt = `Respond with restaurant recommendations in the following format: Restaurant Name; Address. Please do not include numbers or any other prefixes before the restaurant names. Given the question: "${question}", please provide the recommendations.`;
        
//         const completion = await this.openai.chat.completions.create({
//             model: "gpt-3.5-turbo",
//             messages: [
//                 { role: "system", content: prompt }
//             ],
//         });
//         const formattedResponse = completion.choices[0].message.content;
//         return formattedResponse;
//     } catch (error) {
//         console.error('Error in OpenAI API call:', error);
//         throw error;
//     }
// }

async ask(question) {
    try {
        // Crafting a clear and explicit prompt to guide the AI's response format
        const prompt = `Respond with restaurant recommendations by listing only their names and addresses in the following format:\n\nRestaurant Name; Address.\n\nFor example:\nAmber India; 2290 El Camino Real, Mountain View, CA 94040.\n\nBased on the question: "${question}", please list the recommendations without using numbers or any prefixes before the restaurant names.`;
        
        const completion = await this.openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: prompt }
            ],
        });
        const formattedResponse = completion.choices[0].message.content;
        console.log("Formatted Response from OpenAI:", formattedResponse);
        return formattedResponse;
    } catch (error) {
        console.error('Error in OpenAI API call:', error);
        throw error;
    }
}



}

module.exports = OpenAIChatService;
