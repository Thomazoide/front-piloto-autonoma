import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";
import { Dispatch, ReactElement, SetStateAction } from "react";

interface MIProps{
    sede: string
    sala: string
    show: boolean
    setShow: Dispatch<SetStateAction<boolean>>
}

export default function ModalInfo(props: Readonly<MIProps>): ReactElement{
    return(
        <Modal
        size="xs"
        isOpen={props.show}>
            <ModalContent>
                {
                    
                        <>
                        <ModalHeader>
                            <h4>
                                Sede: {props.sede}
                            </h4>
                        </ModalHeader>
                        <ModalBody>
                            <p>
                                Sala: {props.sala}
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onPress={ () => props.setShow(false) } >
                                Cerrar
                            </Button>
                        </ModalFooter>
                        </>
                    
                }
            </ModalContent>
        </Modal>
    )
}