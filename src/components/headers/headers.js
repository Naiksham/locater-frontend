import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { FaCamera } from 'react-icons/fa';

const Header = () => {
  return (
    <Navbar
      expand="lg"
      className="shadow-lg"
      style={{
        backgroundColor: '#fff8dc', // Light yellow background
        padding: '0.8rem 1rem',
        borderBottom: '2px solid #f4c542', // Optional golden border for style
      }}
    >
      <Container>
        {/* Brand with Camera Logo */}
        <Navbar.Brand
          href="#home"
          className="d-flex align-items-center"
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#333',
            letterSpacing: '1px',
            transition: 'transform 0.3s ease-in-out',
          }}
          onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
        >
          <FaCamera size={32} className="me-2" style={{ color: '#f4c542' }} />
          Lens-Locater
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Account Dropdown Menu */}
          <Nav className="ms-auto">
            <NavDropdown
              title="Account"
              id="basic-nav-dropdown"
              className="text-dark"
              style={{ fontSize: '1.2rem' }}
            >
              <NavDropdown.Item
                href="/Register"
                style={{
                  color: '#333',
                  backgroundColor: '#fff8dc',
                  transition: '0.3s',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#f4c542')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#fff8dc')}
              >
                Register
              </NavDropdown.Item>

              <NavDropdown.Item
                href="/Login-form"
                style={{
                  color: '#333',
                  backgroundColor: '#fff8dc',
                  transition: '0.3s',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#f4c542')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#fff8dc')}
              >
                Login
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
