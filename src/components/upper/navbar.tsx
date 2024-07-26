import { useAuthContext } from "@/hooks/useLoginContext"
import { PersonSquare32Regular } from "@fluentui/react-icons"
import { Button } from "@nextui-org/button"
import { ReactElement } from "react"
import { Navbar, Nav, Image } from "react-bootstrap"
import { actionTypes, User } from "@/context/loginContext"

type Nprops = {
    llaveActiva: "1" | "2" | "3" | "4" | "5"
}

export default function NavBar(props: Readonly<Nprops>): ReactElement{
    const { state, dispatch } = useAuthContext()

    const handleNavigate = (e: any): void => {
        if(state.user){
            const newUserData: User = {
                data: state.user.data,
                token: state.user.token,
                page: e.target.accessKey,
                mensaje: state.user.mensaje
            }
            dispatch( {type: actionTypes.CHANGE_PAGE, payload: newUserData} )
        }
    }

    return(
        <Navbar collapseOnSelect expand='lg' className="bg-ua-gray shadow-lg" data-bs-theme="dark" sticky="top">
            
                <Navbar.Brand href='/home' className="max-h-[80px] shadow-sm ">
                    
                    <Image alt="logo-uautonoma" src="https://hipic-vet-soft-backend.s3.us-west-1.amazonaws.com/autonoma/autonoma-logo.png" className="max-h-[70px]"/>
                    
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            
            <Navbar.Collapse id='rsponsive-navbar-nav' >
                <Nav className='me-auto justify-evenly w-[100%]' defaultActiveKey={props.llaveActiva}>
                    <Nav.Link eventKey={"1"} accessKey="/home" href='/home' onClick={handleNavigate}>Inicio</Nav.Link>
                    <Nav.Link eventKey={"2"} accessKey="/sedes" href='/sedes'>Sedes</Nav.Link>
                    <Nav.Link eventKey={"3"} href='#docentes'>Docentes</Nav.Link>
                    <Nav.Link eventKey={"4"} accessKey="/guardias" href='/guardias' onClick={handleNavigate} >Guardias</Nav.Link>
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
