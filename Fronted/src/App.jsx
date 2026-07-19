import React from 'react'
import { useState } from 'react'
import Sidebar from './Sidebar'
import ChatWindow from './ChatWindow'
import { Context } from '../Context'
import { v4 as uuid } from "uuid";

import './App.css'

function App() {
  
    const [prompt,setPrompt]=useState("");
     const [reply,setReply]=useState(null);
    const [currThreadId,setCurrThreadId]=useState(uuid());
    const providerValues= {
      prompt,setPrompt,
      reply,setReply,
      currThreadId,setCurrThreadId

    };

  return (
    <div className='app'>
      <Context.Provider value={providerValues}>

     <Sidebar></Sidebar>
     <ChatWindow></ChatWindow>

      </Context.Provider>
  
      
    </div>
  )
}

export default App
