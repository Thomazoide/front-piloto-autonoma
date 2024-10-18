import { worker } from "@/types/worker";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { Dispatch, ReactElement, SetStateAction } from "react";
import EditWorker from "../editWorker";

interface EWProps{
    workerType: "guardia" | "docente"
    entity: worker
    token: string
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    refetch: () => Promise<void>
}

export default function EditWorkerModal(props: Readonly<EWProps>): ReactElement{
    function onOpenChange(){
        props.setIsOpen(!props.isOpen)
    }
    return(
        <>
        <Modal isOpen={props.isOpen} onOpenChange={onOpenChange} isDismissable={false} placement="bottom">
            <ModalContent>
                {
                    (onClose) => (
                        <>
                        <ModalHeader className="flex flex-col gap-1">
                            Editar {props.workerType}
                        </ModalHeader>
                        <ModalBody className="flex justify-center">
                            <EditWorker entity={props.entity} tipo={props.workerType} token={props.token}/>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onPress={ () => {
                                props.refetch()
                                onClose()
                            } }>
                                Cerrar
                            </Button>
                        </ModalFooter>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
        </>
    )
}