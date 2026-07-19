import React from 'react'
import "./Sidebar.css";

function Sidebar() {
    return (
        <section className='Sidebar'>
            {/* new chat btn */}

            <button>
                <img src="src/assets/blacklogo.png" alt="gpt logo" className='logo' />
                <span> <i className="fa-solid fa-pen-to-square"></i> </span>
           
            </button>

            {/* history */}
            <ul className='history'>
                <li>list1</li>
                 <li>list2</li>
                <li>list3</li>
                <li>list4</li>
                <li>list5</li>
            </ul>

        {/* Sign in */}
        <p className='sign'>My page &hearts;</p>
           
           
        </section>
        
    )
}

export default Sidebar
