import React from 'react';
import { FaTasks } from 'react-icons/fa';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <FaTasks className="logo-icon" />
      <h1>My To-Do List</h1>
    </header>
  );
};

export default Header;