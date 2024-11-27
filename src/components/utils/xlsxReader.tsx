import { Dispatch, ReactElement, SetStateAction, useEffect, useState } from 'react';
import * as xlsx from 'xlsx';
import { worker } from "@/types/worker"
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spinner } from '@nextui-org/react';
import axios, { AxiosRequestConfig } from 'axios';

interface readerProps{
    file: Blob
    showModal: boolean
    setShowModal: Dispatch<SetStateAction<boolean>>
    token: string
}

export default function XlsxReader(props: Readonly<readerProps>): ReactElement {
    const [fileData, setFileData] = useState<Partial<worker>[]>()
    const [isReadingFile, setIsReadingFile] = useState<boolean>(false)
    const [readingError, setReadingError] = useState<Error>()
    const [uploadError, setUploadError] = useState<boolean>(false)
    const [uploadSuccess, setUploadSuccess] = useState<boolean>(false)

    const onOpenChange = function(){
        props.setShowModal(!props.showModal)
    }

    const uploadData = async function(docentes: Partial<worker>[]){
        const ENDPOINT: string = `${import.meta.env.VITE_API_URL}/docente/add-many`
        const CONFIG: AxiosRequestConfig = {
            headers: {
                Authorization: `Bearer ${props.token}`
            }
        }
        await axios.post(ENDPOINT, docentes, CONFIG)
            .then( (res) => res.status < 300 && setUploadSuccess(true) )
            .catch( (err) => err && setUploadError(true) )
    }

    const handleProceed = function(){
        if(!fileData){
            return
        }
        uploadData(fileData)
    }

    const handleFileUpload = function(){
        if(!props.file){
            return
        }
        const reader = new FileReader()
        reader.onload = (e) => {
            try{
                setIsReadingFile(true)
                console.log(e.target!.result)
                const data = new Uint8Array(e.target!.result as ArrayBuffer)
                const workBook = xlsx.read(data, {type: 'array'})
                const sheetName = workBook.SheetNames[0]
                const workSheet = xlsx.utils.sheet_to_json<Partial<worker>>(workBook.Sheets[sheetName])
                console.log(workSheet)
                const validWorkers: Partial<worker>[] = workSheet.filter( (w) => (w.celular && w.email && w.nombre && w.rut) )
                console.log(validWorkers)
                if(!validWorkers[0]){
                    console.log("tirando error")
                    throw new Error("Data invalida...")
                }
                setFileData(validWorkers)
                setIsReadingFile(false)
            }catch(err: any){
                setReadingError(new Error("Data invalida..."))
                setIsReadingFile(false)
                console.log(err)
            }
        }
        reader.readAsArrayBuffer(props.file)
    }

    useEffect( () => {
        handleFileUpload()
    }, [props.file] )

    return(
        <Modal isOpen={props.showModal} onClose={
            () => {
                onOpenChange()
                setReadingError(undefined)
                setUploadSuccess(false)
                setUploadError(false)
            }
        } onOpenChange={onOpenChange} isDismissable={false} placement="bottom">
            <ModalContent>
                {
                    (onClose) => (
                        <>
                            <ModalHeader className="flex justify-center">
                                Carga masiva de datos
                            </ModalHeader>
                            <ModalBody className='flex flex-col items-center gap-2 justify-center'>
                                {
                                    isReadingFile &&
                                    <Spinner color="danger" size="sm" label="Cargando archivo..."/>
                                }
                                {
                                    readingError &&
                                    <p>
                                        Error, {readingError.message}
                                    </p>
                                }
                                {
                                    !readingError && fileData &&
                                    <p>
                                        Estás por agregar {fileData.length} docentes al sistema...
                                        <br/>
                                        ¿Proceder con la operación?
                                    </p>
                                }
                                {
                                    uploadSuccess &&
                                    <div className="flex justify-center w-full opacity-75 border-double border-2 border-warning-400 bg-success-500 text-white rounded-xl shadow-md h-fit p-[10px] ">
                                        <p>
                                            Datos cargados correctamente...
                                        </p>
                                    </div>
                                }
                                {
                                    uploadError &&
                                    <div className="flex justify-center opacity-75 w-full border-double border-2 border-warning-400 bg-danger-500 text-white rounded-xl shadow-md h-fit p-[10px] " >
                                        <p>
                                            Error en la carga de datos...
                                        </p>
                                    </div>
                                }
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="bordered" onPress={() => {
                                        setUploadSuccess(false)
                                        setUploadError(false)
                                        setReadingError(undefined)
                                        onClose()
                                    }}>
                                    {
                                        !readingError ?
                                        "Cancelar"
                                        : "Cerrar"
                                    }
                                </Button>
                                <Button color="danger" variant="solid" isDisabled={(readingError ? true : false) || (uploadSuccess) || (uploadError)} onClick={handleProceed} >
                                    Proceder
                                </Button>
                            </ModalFooter>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
    )
}