import React, { useEffect, useState ,useRef} from 'react'
import "./Sidebar.css";
import { useContext } from 'react';
import { Context } from './Context';
import { v4 as uuid } from "uuid";


function Sidebar() {
    const{allThreads,setAllThreads,currThreadId,threadId,setNewChat,setPrompt,setReply,setCurrThreadId,setPrevChats,theme,setTheme, setIsAuthenticated,currentPage, setCurrentPage}=useContext(Context)
    const [isMenuOpen, setIsMenuOpen]=useState(false)
    const profileRef = useRef(null);
    const user = JSON.parse(localStorage.getItem("user"));
    const getAllThreads=async()=>{
        try {
            const response= await fetch("http://localhost:8080/api/thread")
            const res= await response.json();
            const filteredData=res.map(thread=>({threadId:thread.threadId, title:thread.title}))
            console.log(filteredData);
            setAllThreads(filteredData)
            
        } catch (err) {
            console.log(err);
            
        }

    };
    useEffect(()=>{
getAllThreads()
    },[]);

    const createNewChat=()=>{
        setCurrentPage("chat");
        setNewChat(true),
        setPrompt(""),
        setReply(null),
        setCurrThreadId(uuid()),
        setPrevChats([])

      
    }
      const changeThread=async (newThreadId)=>{
            setCurrentPage("chat");
            setCurrThreadId(newThreadId)
            try {
               const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
                const res= await response.json();
                console.log(res);
                setPrevChats(res);
                setNewChat(false)
                setReply(null)
                
                
            } catch (err) {
                console.log(err);
                
                
            }

        }
        const deleteThread=async (threadId)=>{
            try {
                const response=await fetch(`http://localhost:8080/api/thread/${threadId}`,{method:"DELETE"});
                const res=await response.json();
                console.log(res);
                setAllThreads(prev=>prev.filter(thread=>thread.threadId != threadId));
                if(threadId===currThreadId){
                    createNewChat()
                }
                
                
            } catch (err) {
                console.log(err);
                
            }
        }
        useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      profileRef.current &&
      !profileRef.current.contains(event.target)
    ) {
      setIsMenuOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

const handleLogout = () => {

  // JWT token remove
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // authentication false
  setIsAuthenticated(false);

  // profile menu close
  setIsMenuOpen(false);
};
    return (
        <section className='Sidebar'>
            {/* new chat btn */}

            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo (2).png" alt="gpt logo" className='logo' />
                <span> <i className="fa-solid fa-pen-to-square"></i> </span>
           
            </button>

            {/* history */}
            <ul className='history'>
             {
                allThreads?.map((thread,idx)=>(
                       <li key={thread.threadId} onClick={()=>changeThread(thread.threadId)} 
                       className={thread.threadId===currThreadId ?"highlight":""}>
                         {thread.title}
                         <i className='fa-solid fa-trash' onClick={(e)=>{
                                 e.stopPropagation();
                                 deleteThread(thread.threadId);
                         }}></i>
                         </li>

                ))
             }
                   
            </ul>

        {/* Sign in */}
          <section
  className="profile"
  ref={profileRef}
  onClick={() => setIsMenuOpen(!isMenuOpen)}
>

  <div className="avatar">
    {user?.name?.charAt(0).toUpperCase()}
  </div>

  <div className="user-info">
   <h3>{user?.name}</h3>
    <p>Free Plan</p>
  </div>

  <div className="arrow" >
    {isMenuOpen ? "▲" : "▼"}
  </div>
    <div className={`profile-menu ${isMenuOpen ? "show" : ""}`}>
  <div
  className="menu-item"
  onClick={(e) => {
    e.stopPropagation();
    setCurrentPage("profile");
    setIsMenuOpen(false);
  }}
>
  👤 My Profile
</div>
  <div
  onClick={() =>
    setTheme(theme === "dark" ? "light" : "dark")
  }
>
  {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
</div>
  <div>⚙️ Settings</div>
  <hr />
<div
  className="logout"
  onClick={(e) => {
    e.stopPropagation();
    handleLogout();
  }}
>
  🚪 Logout
</div>
</div>

</section>
           
           
        </section>
        
    )
}

export default Sidebar
