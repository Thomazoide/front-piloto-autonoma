import { worker } from "@/types/worker";
import { Modal, ModalContent, ModalBody, Button, ModalHeader } from "@nextui-org/react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { Dispatch, SetStateAction, ReactElement, useState } from "react";

interface DWProps {
    workerType: "guardia" | "docente"
    entity: worker
    token: string
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
    refetch: () => Promise<void>
}

export default function DeleteWorkerModal(props: Readonly<DWProps>): ReactElement {
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const [isDeleted, setIsDeleted] = useState<boolean>(false)
    function onOpenChange() {
        props.setIsOpen(!props.isOpen)
    }
    async function handleDelete() {
        setIsDeleting(true)
        const CONFIG: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${props.token}`
            },
            data: props.entity
        }
        const DELETE_WORKER_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/${props.workerType}`
        const response: AxiosResponse = await axios.delete(DELETE_WORKER_ENDPOINT, CONFIG)
        if(response.status >= 200 && response.status < 300 ){
            setIsDeleted(true)
        }
        setIsDeleting(false)
    }
    return(
        <>
        <Modal isOpen={props.isOpen} onOpenChange={onOpenChange} isDismissable={false} placement="bottom">
            <ModalContent>
                {
                    (onClose) => (
                        <>
                        <ModalHeader className="flex flex-col gap-1">
                            Eliminar {props.workerType}
                        </ModalHeader>
                        <ModalBody className="flex flex-col items-center p-[15px]">
                            <div className="flex justify-center">
                                <p className="font-bold text-xl">
                                    Seguro que quiere eliminar al {props.workerType}:
                                    <br/>
                                    {props.entity.nombre}
                                    <br/>
                                    Rut: {props.entity.rut}?
                                </p>
                            </div>
                            <div className="flex flex-row justify-evenly">
                                <Button color="success" variant="light" onPress={() => onClose()} isLoading={isDeleting}>
                                    Cancelar
                                </Button>
                                <Button color="danger" variant="solid" isLoading={isDeleting} onPress={ () => {
                                    handleDelete()
                                    props.refetch()
                                    onClose()
                                } } isDisabled={isDeleted}>
                                    Eliminar
                                </Button>
                            </div>
                        </ModalBody>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
        </>
    )
}