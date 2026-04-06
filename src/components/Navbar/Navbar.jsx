import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import WalletConnector from "../Wallet/WalletConnector";

const Navbar = () => {
  const [navHeight, setNavHeight] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className={navHeight ? "show nav" : "nav"}>
      <div className="logo" onClick={() => navigate("/")}>
        PROPERTY RENTALS
      </div>
      <ul>
        <li>
          <Link to={"/aboutus"}>ABOUT US</Link>
        </li>
        <li>
          <Link to={"/villas"}>VILLAS</Link>
        </li>
        <li>
          <Link to={"/contact"}>CONTACT</Link>
        </li>
      </ul>
      <WalletConnector />
      <RxHamburgerMenu
        className="hamburger"
        onClick={() => setNavHeight(!navHeight)}
      />
    </nav>
  );
};

export default Navbar;
