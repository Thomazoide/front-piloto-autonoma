import { PersonSquare32Regular } from "@fluentui/react-icons"
import { ReactElement } from "react"
import { Navbar, Nav, Image } from "react-bootstrap"

export default function NavBar(): ReactElement{
    return(
        <Navbar collapseOnSelect expand='lg' className="bg-ua-gray " data-bs-theme="dark" sticky="top">
            
                <Navbar.Brand href='#home' className="max-h-[80px] ">
                    
                    <Image alt="logo-uautonoma" src="https://hipic-vet-soft-backend.s3.us-west-1.amazonaws.com/autonoma/autonoma-logo.png" className="max-h-[70px]"/>
                    
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            
            <Navbar.Collapse id='rsponsive-navbar-nav' >
                <Nav className='me-auto justify-evenly w-[100%]' defaultActiveKey={"1"}>
                    <Nav.Link eventKey={1} href='#inicio'>Inicio</Nav.Link>
                    <Nav.Link eventKey={2} href='#sedes'>Sedes</Nav.Link>
                    <Nav.Link eventKey={3} href='#docentes'>Docentes</Nav.Link>
                    <Nav.Link eventKey={4} href='#guardias'>Guardias</Nav.Link>
                    <PersonSquare32Regular className="bg-red-500 rounded-lg"/>
                </Nav>
            </Navbar.Collapse>
            
        </Navbar>
    )
}
