import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container, Dropdown, Button } from "react-bootstrap";
import NavDropdown from "react-bootstrap/NavDropdown";
import "./CSS/NavBarStyles.css";

const NavBar = ({ user, onLogout }) => {
  const [pollsDropdownOpen, setPollsDropdownOpen] = useState(false);
  
  const handleDropdwonClick = () => {
    setPollsDropdownOpen(false);
    setTimeout(() => {
      const dropdown = document.getElementById('polls-nav-dropdown');
      if (dropdown) dropdown.blur();
    }, 100);
  }

return (
    <Navbar bg="light" expand="md" className="mb-3">
      <Container>
        <Navbar.Brand as={Link} to="/">Home</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav"/>
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="ms-auto">
            {user ? (
              <>
                <Navbar.Text className="me-4">
                  Welcome, <strong>{user.username}</strong>!
                </Navbar.Text>
                <Nav.Link as={Link} to="/me" className="me-2">Profile</Nav.Link>
                {user.role === "admin" && (
                  <Nav.Link as={Link} to="/users" className="me-2">Users</Nav.Link>
                )}
                <Nav.Link as={Link} to="/search-friends" className="me-2">Find Friends</Nav.Link>

                <Dropdown
                  className="nav-item dropdown hover-dropdown me-2"
                  onMouseEnter={() => setPollsDropdownOpen(true)}
                  onMouseLeave={() => setPollsDropdownOpen(false)}
                  show={pollsDropdownOpen}
                >
                  <Dropdown.Toggle
                    as="a"
                    className="nav-link"
                    href="#"
                    id="polls-nav-dropdown"
                  >
                    Polls <span className={`arrow ${pollsDropdownOpen ? "rotate" : ""}`}>&#9662;</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/new-poll" onClick={handleDropdwonClick}>Create Poll</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/poll-list" onClick={handleDropdwonClick}>Poll List</Dropdown.Item>
                    <Dropdown.Item as={Link} to="/edit-draft" onClick={handleDropdwonClick}>Drafted Polls</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Nav.Item className="d-flex align-items-center">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-3"
                    onClick={onLogout}
                  >
                    Logout
                  </Button>
                </Nav.Item>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/poll-list" className="me-2">Public Polls</Nav.Link>
                <Nav.Link as={Link} to="/login" className="me-2">Login</Nav.Link>
                <Nav.Link as={Link} to="/signup" className="me-2">Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
