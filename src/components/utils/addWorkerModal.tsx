import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { Dispatch, ReactElement, SetStateAction } from "react";
import AddWorker from "../addWorker";

interface AWProps{
    token: string
    tipo: "docente" | "guardia"
    showModal: boolean
    setShowModal: Dispatch<SetStateAction<boolean>>
    refetch: () => Promise<void>
}

export default function AddWorkerModal(props: Readonly<AWProps>): ReactElement{
    function handleOpenChange(){
        props.setShowModal(!props.showModal)
    }
    return(
        <Modal className="max-h-[450px] overflow-scroll" onOpenChange={handleOpenChange} isOpen={props.showModal} isDismissable={false} placement="bottom">
            <ModalContent>
                {
                    (onClose) => (
                        <>
                        <ModalHeader>
                            Agregar {props.tipo}
                        </ModalHeader>
                        <ModalBody>
                            <AddWorker tipo={props.tipo} token={props.token}/>
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="bordered" color="danger" onPress={ () => {
                                props.refetch()
                                onClose()
                            } } >
                                Cerrar
                            </Button>
                        </ModalFooter>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
    )
}