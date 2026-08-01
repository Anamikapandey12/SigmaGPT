import React, { useEffect } from 'react'
import "./Chat.css"
import { Context } from './Context'
import { useContext ,useState,useDeferredValue, useRef} from 'react'
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css"



function Chat() {
       const{newChat,prevChats,reply}=useContext(Context);
       const[latestReply, setLatestReply]=useState(null)
       const chatRef = useRef(null);
       const [showCursor,setShowCursor]=useState(false)
       const [copiedIndex, setCopiedIndex] = useState(null);
     

   useEffect(() => {

      if (reply===null) {
         setLatestReply(null)
         setShowCursor(false)
    return;
  }
       setShowCursor(true)
    if(!prevChats?.length)return;
  const content = reply.split(" ");
  console.log(content);

  let idx = 0;

  const interval = setInterval(() => {
    
    setLatestReply(content.slice(0, idx + 1).join(" "));
   
    idx++;

    if (idx >= content.length) {
        setShowCursor(false)
      clearInterval(interval);
    }
  }, 300);

  return () => clearInterval(interval);
}, [reply]);


useEffect(() => {
    if (!chatRef.current) return;

    chatRef.current.scrollTop = chatRef.current.scrollHeight;
}, [prevChats, latestReply]);
const copyToClipboard = async (text, index) => {
  try {
    await navigator.clipboard.writeText(text);

    setCopiedIndex(index);

    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);

  } catch (err) {
    console.log(err);
  }
};
    return (
        
        <>
        {newChat && <h1>Start a new Chat!</h1>}
        <div className="chat" ref={chatRef}>
            {prevChats.slice(0, -1).map((chat, idx) => (
  <div
    className={chat.role === "user" ? "userDiv" : "gptDiv"}
    key={idx}
  >
    {chat.role === "user" ? (
      <p className="userMessage">{chat.content}</p>
    ) : (
      <div className="gptMessage">
  <ReactMarkdown
    rehypePlugins={[rehypeHighlight]}
    remarkPlugins={[remarkGfm]}
  >
    {chat.content}
  </ReactMarkdown>

<button
  className="copyBtn"
  onClick={() => copyToClipboard(chat.content, idx)}
>
    <i className="fa-regular fa-copy"></i>
    {copiedIndex===idx ? "Copied" : "Copy"}
</button>
</div>
    )}
  </div>
))}
{
  prevChats.length > 0 && (
    latestReply === null ? (
     <div className="gptDiv" key="non-typing">
  <div className="gptMessage">
    <ReactMarkdown
      rehypePlugins={[rehypeHighlight]}
      remarkPlugins={[remarkGfm]}
    >
      {prevChats[prevChats.length - 1].content}
    </ReactMarkdown>

    <button
      className="copyBtn"
      onClick={() =>
        copyToClipboard(
          prevChats[prevChats.length - 1].content,
          "latest"
        )
      }
    >
      <i className="fa-regular fa-copy"></i>
      {copiedIndex === "latest" ? "Copied" : "Copy"}
    </button>
  </div>
</div>
    ) : (
     <div className="gptDiv" key="typing">
  <div className="gptMessage">
    <ReactMarkdown
      rehypePlugins={[rehypeHighlight]}
      remarkPlugins={[remarkGfm]}
    >
      {showCursor ? latestReply + "▌" : latestReply}
    </ReactMarkdown>

    {!showCursor && (
      <button
        className="copyBtn"
        onClick={() => copyToClipboard(latestReply, "latest")}
      >
        <i className="fa-regular fa-copy"></i>
        {copiedIndex === "latest" ? "Copied" : "Copy"}
      </button>
    )}
  </div>
</div>
    )
  )
}   
        </div>
        </>
    )
}

export default Chat
