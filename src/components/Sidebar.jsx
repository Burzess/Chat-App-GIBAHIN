import React from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";
import Footer from "./Footer";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="top">
        <Navbar />
        <Search />
        <Chats />
      </div>
      <Footer />
    </div>
  );
};

export default Sidebar;
