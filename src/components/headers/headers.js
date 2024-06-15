import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

const Header = () => {
  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="#home">Lens-Locater</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <NavDropdown title="Account" id="basic-nav-dropdown">
            <NavDropdown.Item href="/Register">Register</NavDropdown.Item>
            <NavDropdown.Item href="/Login-form">Login</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
    </div>
    
  );
  
};

export default Header;
