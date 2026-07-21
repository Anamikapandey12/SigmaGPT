import React, { useEffect, useState } from 'react'
import "./Sidebar.css";
import { useContext } from 'react';
import { Context } from '../Context';
import { v4 as uuid } from "uuid";

function Sidebar() {
    const{allThreads,setAllThreads,currThreadId,threadId,setNewChat,setPrompt,setReply,setCurrThreadId,setPrevChats}=useContext(Context)
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
        setNewChat(true),
        setPrompt(""),
        setReply(null),
        setCurrThreadId(uuid),
        setPrevChats([])

      
    }
      const changeThread=async (newThreadId)=>{
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
                         {thread.title}</li>
                ))
             }
             
                 
            </ul>

        {/* Sign in */}
        <p className='sign'>My page &hearts;</p>
           
           
        </section>
        
    )
}

export default Sidebar
