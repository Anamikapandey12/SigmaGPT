import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";


dotenv.config();

const app = express();
const Port = 8080;

app.use(express.json());
app.use(cors());
app.use("/api", chatRoutes);

app.listen(Port, () => {
  console.log(`App is running on ${Port}`);
  connnectDB();
});

const connnectDB=async()=>{
   try{
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Connected with database");
    
   }catch(err){
    console.log("failed to connect with Database",err);
    
   }
}
// app.post("/test", async (req, res) => {
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ error: "Message is required" });
//   }

//   try {
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [{ text: message }],
//             },
//           ],
//         }),
//       }
//     );

//     const data = await response.json();
//     const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
//     console.log(text);
    
//     // console.log(data.candidates[0].content[0].parts[0].text);
    
// res.json({ reply: text });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });