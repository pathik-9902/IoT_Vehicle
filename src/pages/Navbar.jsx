import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [menuActive, setMenuActive] = useState(false);

  const handleMenuToggle = () => {
    setMenuActive(!menuActive);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <h1 className="logo">My App</h1>
        <div className="menu-toggle" onClick={handleMenuToggle}>
          ☰ {/* This is the hamburger menu icon */}
        </div>
        <ul className={`nav-links ${menuActive ? 'active' : ''}`}>
          <li>
            <Link to="/pageA">Page A</Link>
          </li>
          <li>
            <Link to="/pageB">Page B</Link>
          </li>
          <li>
            <Link to="/pageC">Page C</Link>
          </li>
          <li>
            <Link to="/pageD">Page D</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
