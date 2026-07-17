import express from "express";
import Thread from "../models/Thread.js";
import getGeminiResponse from "../utils/gemini.js";

const router = express.Router();

router.post("/test", async (req, res) => {
  try {
    const newThread = new Thread({
        threadId: "123456",
        title: "Test Thread",

    });
    const response = await newThread.save();
    res.send(response);
    } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });


  }
});
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });     
    res.json(threads);   
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
})

router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try{
    const thread = await Thread.findOne({ threadId });
    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread.messages);
  }catch(err){
    console.log(err);
    res.status(500).json({ error: "Failed to fetch thread" });
  }
    
});

router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });
    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ message: "Thread deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

router.post("/chat",async(req,res)=>{
      const {threadId,message}=req.body;
       if (!threadId || !message) {
         return res.status(400).json({
          error: "Missing required fields",
  });
}

      try{
      let thread=  await Thread.findOne({threadId});
        
        if(!thread){
          thread=new Thread({
            threadId,
            title:message,
            messages:[{role:"user",content:message}]
          })
        }else{
          thread.messages.push({role:"user",content:message});
        }
       const assistanReply= await getGeminiResponse(message);
       thread.messages.push({role:"assistant",content:assistanReply})
       thread.updatedAt=new Date();

       await thread.save();
       res.json({reply:assistanReply})

      }catch(err){
         console.log(err);
    res.status(500).json({
  error: "Failed to process chat",
});
      }
})
export default router;