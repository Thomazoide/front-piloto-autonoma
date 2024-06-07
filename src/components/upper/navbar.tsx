import { ReactElement } from "react";
import { Navbar, Nav, Container } from "react-bootstrap"

export default function NavBar(): ReactElement{
    return(
        <Navbar collapseOnSelect expand='lg' className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href='#home'>
                    LOGO
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id='rsponsive-navbar-nav'>
                    <Nav className='me-auto'>
                        <Nav.Link href='#sedes'>Adm. sedes</Nav.Link>
                        <Nav.Link href='#docentes'>Adm. docentes</Nav.Link>
                        <Nav.Link href='#guardias'>Adm. guardias</Nav.Link>
                        <Nav.Link href='#ingresos'>Ver ingresos</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
