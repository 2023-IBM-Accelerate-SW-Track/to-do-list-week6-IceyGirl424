import React, { Component } from "react";
import {Navbar, Nav, Container} from 'react-bootstrap'

import {
    BrowserRouter as Router,
    Routes,
    Route, 
    Link
} from "react-router-dom"
import About from "../../pages/About";
import Home from "../../pages/Home";
import TodoListAll from "../../pages/TodoListAll";
import SearchPage from "../../pages/SearchPage";

export default class NavbarComp extends Component {
    render() {
        return (
            <Router>
            <div>
            <Navbar bg="dark" variant={"dark"} expand="lg">
                <Container>
                    {/* <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand> */}
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to={"/"}> Home </Nav.Link>
                        <Nav.Link as={Link} to={"/about"}>About</Nav.Link>
                        <Nav.Link as={Link} to={"/TodoListAll"}>TodoPage</Nav.Link>
                        <Nav.Link as={Link} to={"/SearchPage"}>SearchPage</Nav.Link>
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            </div>
            <div>
                <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route exact path="/about" element={<About/>}/>
                <Route exact path="/TodoListAll" element={<TodoListAll/>}/>
                <Route exact path="/SearchPage" element={<SearchPage/>}/>
                </Routes>
            </div>
            </Router>
        )
    }
}