import { PersonSquare32Regular } from "@fluentui/react-icons"
import { Button } from "@nextui-org/button"
import { ReactElement } from "react"
import { Navbar, Nav, Image } from "react-bootstrap"

type Nprops = {
    llaveActiva: "1" | "2" | "3" | "4" | "5"
}

export default function NavBar(props: Readonly<Nprops>): ReactElement{
    return(
        <Navbar collapseOnSelect expand='lg' className="bg-ua-gray shadow-lg" data-bs-theme="dark" sticky="top">
            
                <Navbar.Brand href='/home' className="max-h-[80px] shadow-sm ">
                    
                    <Image alt="logo-uautonoma" src="https://hipic-vet-soft-backend.s3.us-west-1.amazonaws.com/autonoma/autonoma-logo.png" className="max-h-[70px]"/>
                    
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            
            <Navbar.Collapse id='rsponsive-navbar-nav' >
                <Nav className='me-auto justify-evenly w-[100%]' defaultActiveKey={props.llaveActiva}>
                    <Nav.Link eventKey={"1"} href='/home'>Inicio</Nav.Link>
                    <Nav.Link eventKey={"2"} href='/sedes'>Sedes</Nav.Link>
                    <Nav.Link eventKey={"3"} href='#docentes'>Docentes</Nav.Link>
                    <Nav.Link eventKey={"4"} href='/guardias'>Guardias</Nav.Link>
                    <Nav.Link eventKey={"5"} href="#user">
                        <Button color="danger" variant="solid" isIconOnly>
                            <PersonSquare32Regular/>
                        </Button>
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
            
        </Navbar>
    )
}
