import React from "react";
import "./Profile.css";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div className="profilePage">
  <div className="profileCard">

    <div className="profileAvatar">
     {user?.name?.charAt(0).toUpperCase()}
    </div>

    <h2>{user?.name}</h2>

    <p className="plan">Free Plan</p>

    <div className="profileInfo">

      <div className="infoItem">
        <span className="infoLabel">Email</span>
        <span className="infoValue"> {user?.email}</span>
      </div>

      <div className="infoItem">
        <span className="infoLabel">Plan</span>
        <span className="infoValue">Free</span>
      </div>

      <div className="infoItem">
        <span className="infoLabel">Member</span>
        <span className="infoValue">August 2026</span>
      </div>

    </div>

    <button className="editBtn">
      Edit Profile
    </button>

    <button className="logoutBtn">
      Logout
    </button>

  </div>
</div>
  );
}

export default Profile;