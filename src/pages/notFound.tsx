import { Button } from "@nextui-org/react"
import { ReactElement } from "react"
import { useNavigate } from "react-router-dom"

export default function NotFoundPage(): ReactElement{
    const navegar = useNavigate()
    return(
        <div className="flex flex-col items-center justify-center min-h-[100vh] w-full ">
            <img src="https://hipic-vet-soft-backend.s3.us-west-1.amazonaws.com/autonoma/sad_face.png" width={"400px"} alt="cara triste"/>
            <h2>
                Ha ocurrido un error inesperado...
            </h2>
            <p>
                Si se encontraba navegando, recomendamos que vuelva a iniciar sesión.
            </p>
            <Button color="danger" variant="solid" onClick={ () => navegar("/") }>
                Volver a la página de inicio
            </Button>
        </div>
    )
}