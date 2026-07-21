import dotenv from "dotenv";

dotenv.config();
const getGeminiResponse = async (message) => {
      // const { message } = req.body;

  if (!message) {
    throw new Error("Message is required");
}

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log(data);
    
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  ;
    
    // console.log(data.candidates[0].content[0].parts[0].text);
    
return text;
  } catch(err){
    console.log(err);
    throw err;
}
}
export default getGeminiResponse;