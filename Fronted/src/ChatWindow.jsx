import React, { useContext,useState ,useEffect} from 'react'
import "./ChatWindow.css";
import { Context } from '../Context.jsx';
import Chat from "./Chat.jsx"
import {ScaleLoader} from "react-spinners"

function ChatWindow() {
    const{prompt,setPrompt,reply,setReply,currThreadId,prevChats,setPrevChats}=useContext(Context);
    const [loading, setLoading]=useState(false)

    const getReply=async()=>{
        setLoading(true)
        console.log("message",prompt, "threadId",currThreadId);
        
        const options={
            method:"POST",
            headers:{
                "Content-type":"application/json"
            },
            body:JSON.stringify({
                message:prompt,
                threadId:currThreadId
            })
        };
        try {
       const response=await fetch("http://localhost:8080/api/chat", options);
       const res=await response.json();
          console.log(res);
          setReply(res.reply)
          
            
        } catch (err) {
            console.log(err); 
            
        }
        setLoading(false)
    }
    // Append new chat to prevchats
   useEffect(() => {
  if (prompt && reply) {
    setPrevChats((prevChats) => [
      ...prevChats,
      {
        role: "user",
        content: prompt,
      },
      {
        role: "assistant",
        content: reply,
      },
    ]);
  }

  setPrompt("");
}, [reply]);
    return (
        <div className='chatWindow'>
            <div className='navbar'>
             <span>SigmaGpt<i className="fa-solid fa-angle-down"></i></span>
             <div className="userIconDiv">
                <span className='userIcon'><i className='fa-solid fa-user'></i></span>
             </div>

            </div>

        <Chat></Chat>
      <ScaleLoader color={"#fff"} loading={loading} />

        <div className="chatInput">
            <div className="inputBox">
                <input type="text" placeholder='Ask Anything' value={prompt} 
                onChange={(e) =>setPrompt(e.target.value)}
                onKeyDown={(e)=>e.key ==='Enter'?getReply():''}
                 />
                  <div id="submit"onClick={getReply} >
                   <i className='fa-solid fa-paper-plane'></i>
                  </div>

            </div>

            <p className='info'>
                SigmaGpt can make mistake.Check important info.

            </p>

        </div>
    
       



     
        </div>
        
    )
}

export default ChatWindow
