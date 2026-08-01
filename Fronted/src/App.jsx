import React, { useState ,useEffect} from "react";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Context } from "./Context";
import { v4 as uuid } from "uuid";
import "./App.css";

function App() {
  const [showLogin, setShowLogin] = useState(true);

  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuid());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [theme, setTheme] = useState("dark");

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const providerValues = {
    prompt,
    setPrompt,
    reply,
    setReply,
    currThreadId,
    setCurrThreadId,
    newChat,
    setNewChat,
    prevChats,
    setPrevChats,
    allThreads,
    setAllThreads,
    isAuthenticated,
    setIsAuthenticated,
    theme,setTheme
  };
  useEffect(() => {
  document.body.className = theme;
}, [theme]);

  return (
    <Context.Provider value={providerValues}>
      {isAuthenticated ? (
        <div className="app">
          <Sidebar />
          <ChatWindow />
        </div>
      ) : showLogin ? (
        <Login setShowLogin={setShowLogin} />
      ) : (
        <Register setShowLogin={setShowLogin} />
      )}
    </Context.Provider>
  );
}

export default App;