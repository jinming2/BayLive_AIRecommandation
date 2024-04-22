// proxy.js
const ChatService = require('./chatService');

class OpenAIChatServiceProxy extends ChatService {
  constructor(realSubject) {
    super();
    this.realSubject = realSubject;
  }

  async ask(question) {
    console.log(`Received question for processing: ${question}`);
    
    try {
      const rawAnswer = await this.realSubject.ask(question);
      // Add any post-processing here
      const processedAnswer = this.processAnswer(rawAnswer);
      console.log(`Processed answer: ${JSON.stringify(processedAnswer)}`);
      return processedAnswer;
    } catch (error) {
      console.error('Error processing the request through proxy:', error);
      throw error;  // Or handle the error as needed
    }
  }

  processAnswer(answer) {
    const lines = answer.split('\n').map(line => line.trim()); // Split by new lines and trim each line
    const results = lines.map(item => {
        // Normalize the item by removing unwanted prefixes
        const normalizedItem = item.replace(/^- /, '');  // Removes the "- " prefix if it exists

        // Check for the presence of a semicolon which might indicate a structured response
        const parts = normalizedItem.split(';');
        if (parts.length === 2) {
            // Attempt to further identify if the parts follow a "restaurant" format
            const name = parts[0].trim();
            const addressDetails = parts[1].trim();
            // Check if address details actually look like an address or contain descriptive content
            if (addressDetails.includes(',')) {  // Assuming addresses will contain commas
                return { type: "restaurant", name: name, address: addressDetails };
            } else {
                // If not, treat as a chat message that might just be using a semicolon in its text
                return { type: "chat", response: normalizedItem };
            }
        } else {
            // All other formats treated as chat
            return { type: "chat", response: normalizedItem };
        }
    });
    return results;
}


}

module.exports = OpenAIChatServiceProxy;
