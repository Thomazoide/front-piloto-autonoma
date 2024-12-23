import { useAuthContext } from "@/hooks/useLoginContext"
import { DoorArrowLeft24Regular, LaptopPerson24Regular, PersonSquare32Regular, PersonWrench20Regular } from "@fluentui/react-icons"
import { Button, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu } from "@nextui-org/react"
import { ReactElement } from "react"
import { Navbar, Nav, Image } from "react-bootstrap"
import { actionTypes, User } from "@/context/loginContext"
import { useLogout } from "@/hooks/useLogout"
import { useNavigate } from "react-router-dom"

type Nprops = {
    llaveActiva: "1" | "2" | "3" | "4" | "5"
}

export default function NavBar(props: Readonly<Nprops>): ReactElement{
    const { state, dispatch } = useAuthContext()
    const {logout} = useLogout()
    const navegar = useNavigate()

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

    const handleMyCuenta = () => {
        navegar(`/account/${state.user?.token.split('.')[0]}`)
    }

    const handleUsers = () => {
        navegar(`/users/${state.user?.token.split('.')[0]}`)
    }

    const handleLogout = () => {
        logout()
        navegar('/')
    }

    return(
        <Navbar collapseOnSelect expand='lg' className="bg-ua-gray shadow-lg" data-bs-theme="dark" sticky="top">
            
                <Navbar.Brand href={`/dashboard/${state.user?.token.split('.')[0]}`} className="max-h-[80px] shadow-sm ">
                    
                    <Image alt="logo-uautonoma" src="https://storagejca.s3.sa-east-1.amazonaws.com/autonoma-logo.webp" className="max-h-[70px]"/>
                    
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            
            <Navbar.Collapse id='rsponsive-navbar-nav' >
                <Nav className='me-auto justify-evenly items-center align-center w-[100%]' defaultActiveKey={props.llaveActiva}>
                    <Nav.Link eventKey={"1"} accessKey={`/dashboard`} href={`/dashboard/${state.user?.token.split('.')[0]}`} onClick={handleNavigate}>Inicio</Nav.Link>
                    <Nav.Link eventKey={"2"} accessKey={`/sedes`} href={`/sedes/${state.user?.token.split('.')[0]}`} onClick={handleNavigate}>Sedes</Nav.Link>
                    <Nav.Link eventKey={"3"} accessKey={`/docentes`} href={`/docentes/${state.user?.token.split('.')[0]}`} onClick={handleNavigate} >Docentes</Nav.Link>
                    <Nav.Link eventKey={"5"} href="#user" className="text-center">
                        <Dropdown>
                            <DropdownTrigger>
                                <Button color="danger" variant="flat" startContent={<PersonSquare32Regular/>} >
                                    {state.user?.data?.nombre}
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem startContent={<LaptopPerson24Regular/>} onClick={handleMyCuenta} >
                                    Mi cuenta
                                </DropdownItem>
                                {
                                    state.user && state.user.data.isAdmin &&
                                    <DropdownItem startContent={ <PersonWrench20Regular/> } onClick={handleUsers} >
                                        Administrar usuarios
                                    </DropdownItem>
                                }
                                <DropdownItem startContent={<DoorArrowLeft24Regular/>} onClick={handleLogout}>
                                    Cerrar sesion
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Nav.Link>
                </Nav>
            </Navbar.Collapse>
            
        </Navbar>
    )
}
