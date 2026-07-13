import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

const app=express();
const Port=8080;

app.use(express.json)
app.

app.listen(Port,()=>{
    console.log(`app is running ${Port}`);
    
})

