import React, { useContext,useState ,useEffect,useRef} from 'react'
import "./ChatWindow.css";
import { Context } from './Context.jsx';
import Chat from "./Chat.jsx"
import {ScaleLoader} from "react-spinners"

function ChatWindow() {
    const{prompt,setPrompt,reply,setReply,currThreadId,prevChats,setPrevChats,setNewChat}=useContext(Context);
    const [loading, setLoading]=useState(false)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = useRef(null);
 const [isListening, setIsListening] = useState(false);

    useEffect(() => {
  if (!SpeechRecognition) return;

  recognition.current = new SpeechRecognition();

  recognition.current.continuous = false;
  recognition.current.interimResults = false;

  recognition.current.lang = "en-US";

  recognition.current.onresult = (event) => {
    const transcript = event.results[0][0].transcript;

    setPrompt(transcript);
  };
  recognition.current.onend = () => {
  setIsListening(false);
};

  recognition.current.onerror = (event) => {
    setIsListening(false);
    console.log(event.error);
    
  };
}, []);
  const startListening = () => {
    if (!recognition.current) return;
      setIsListening(true);

    recognition.current.start();
  };
  

    const getReply=async()=>{
        if (!prompt.trim()) return;

    setNewChat(false);   

    setLoading(true);
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
        <div className="loader-container">
           <ScaleLoader color={"#fff"} loading={loading} />
        </div>
     
<div className="chatInput">
  <div className="inputBox">
    <input
      type="text"
      placeholder={isListening ? "Listening..." : "Ask Anything"}

      value={prompt}
      disabled={loading}
      onChange={(e) => setPrompt(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !loading) {
          getReply();
        }
      }}
    />
 <div
  id="mic"
  onClick={!isListening ? startListening : undefined}
  className={isListening ? "listening" : ""}
  title={isListening ? "Listening..." : "Click to speak"}
  style={{
    cursor: isListening ? "not-allowed" : "pointer",
    opacity: isListening ? 0.7 : 1,
  }}
>
  <i className="fa-solid fa-microphone"></i>
</div>


    <div
      id="submit"
      onClick={!loading ? getReply : undefined}
      style={{
        opacity: loading ? 0.5 : 1,
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      <i className="fa-solid fa-paper-plane"></i>
    </div>
    
  
  </div>


  <p className="info">
    SigmaGpt can make mistakes. Check important info.
  </p>
</div>
     
  </div>
        
    )
}

export default ChatWindow
