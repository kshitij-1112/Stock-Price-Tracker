import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import the CSS file (assuming it's in the same directory)

function Header() {
  return (
    <header className="header">
      <h1 className="header-title">Stock Tracker</h1>
      <nav className="header-nav">
        <ul className="header-list">
          <li className="header-item">
            <Link to="/register" className="header-link">
              Register
            </Link>
          </li>
          <li className="header-item">
            <Link to="/login" className="header-link">
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
