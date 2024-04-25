// chatService.js
const OpenAI = require('openai');
const POI = require('./models/poi');

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

async ask(question) {
  try {
      // Step 1: Retrieve POI data from your database
      const pois = await this.getPOIData2(); // You need to implement this method

      // Step 2: Format the data into a string that GPT can use
      const poiList = pois.map(poi => `${poi.name}; ${poi.description};${poi.address};${poi.category}`).join("\n");

      // Step 3: Crafting a clear and explicit prompt for the AI
      const prompt = `Based on the question: "${question}", please list the possible recommendations from the following points of interest:\n${poiList}\n\nRespond with Point of Interest recommendations by listing only their names and addresses in the following format:\n\nPoint of Interest Name; Address.\n\n or can also include other chat response.`;

      // Step 4: Call the GPT model with the crafted prompt
      const completion = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
              { role: "system", content: prompt }
          ],
      });

      // Step 5: Process and log the formatted response from GPT
      const formattedResponse = completion.choices[0].message.content;
      console.log("Formatted Response from OpenAI:", formattedResponse);
      return formattedResponse;
  } catch (error) {
      console.error('Error in OpenAI API call:', error);
      throw error;
  }
}

// Example method to fetch POI data from a database
// async getPOIData() {
//   // Mock data array simulating what might be returned from a database query
//   return [
//     { name: "Central Park", description: "A sprawling public park known for its lush landscapes and numerous outdoor activities available year-round.", address: "5 Av to Central Park West, 59 St to 110 St, New York, NY 10022", category: "Parks" },
//     { name: "The Metropolitan Museum of Art", description: "One of the world's largest and finest art museums, home to a vast array of art and artifacts from different epochs.", address: "1000 5th Ave, New York, NY 10028", category: "Museums" },
//     { name: "Empire State Building", description: "A landmark Art Deco skyscraper recognized as an icon of New York City, offering breathtaking city views.", address: "20 W 34th St, New York, NY 10118", category: "Landmarks" },
//     { 
//       name: "Nobu", 
//       description: "Renowned for its innovative new-style Japanese cuisine, Nobu offers a unique blend of traditional Japanese dishes with Peruvian ingredients.", 
//       address: "195 Broadway, New York, NY 10007", 
//       category: "Japanese" 
//     },
//     { 
//       name: "Le Bernardin", 
//       description: "A temple of French seafood cuisine, Le Bernardin is known for its refined dishes emphasizing the purity of its ingredients.", 
//       address: "155 W 51st St, New York, NY 10019", 
//       category: "French" 
//     },
//     { 
//       name: "Dhaba", 
//       description: "Vibrant and bustling, Dhaba serves up authentic North Indian cuisine in the heart of Manhattan’s Little India.", 
//       address: "108 Lexington Ave, New York, NY 10016", 
//       category: "Indian" 
//     },
//     { 
//       name: "Guelaguetza", 
//       description: "Celebrated for its authentic Oaxacan dishes, Guelaguetza is a cultural hub known for its moles and traditional Mexican cuisine.", 
//       address: "3014 W Olympic Blvd, Los Angeles, CA 90006", 
//       category: "Mexican" 
//     },
//     { 
//       name: "Eataly", 
//       description: "A bustling Italian marketplace with a variety of restaurants, counters, and cafes offering an array of regional Italian fare.", 
//       address: "200 Fifth Avenue, New York, NY 10010", 
//       category: "Italian" 
//     },
//     { 
//       name: "Addis Ethiopian Restaurant", 
//       description: "A cozy spot offering a range of traditional Ethiopian dishes with a focus on communal dining and sharing platters.", 
//       address: "707 H St NE, Washington, DC 20002", 
//       category: "Ethiopian" 
//     },
//     { 
//       name: "Jing Fong", 
//       description: "One of Chinatown’s largest restaurants, Jing Fong is famed for its dim sum served via traditional rolling carts.", 
//       address: "20 Elizabeth St, New York, NY 10013", 
//       category: "Chinese" 
//     },
//     { 
//       name: "Bazaar Meat by José Andrés", 
//       description: "A lavish dining experience from José Andrés, featuring inventive presentations of classic meat dishes and more.", 
//       address: "2535 S Las Vegas Blvd, Las Vegas, NV 89109", 
//       category: "Spanish" 
//     }
//   ];
// }


async getPOIData2() {
  try {
    // Specify fields to include using a projection object
    return await POI.find({}, 'name description address category');
  } catch (error) {
    console.error('Failed to fetch POIs:', error);
    throw error;
  }
}





}

module.exports = OpenAIChatService;
