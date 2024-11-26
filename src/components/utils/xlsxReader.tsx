import { ReactElement, useEffect, useState } from 'react';
import * as xlsx from 'xlsx';
import { worker } from "@/types/worker"

interface readerProps{
    file: File
}

export default function XlsxReader(props: Readonly<readerProps>): ReactElement {
    const [fileData, setFileData] = useState<Partial<worker>[]>()

    async function handleFileUpload(){
        const reader = new FileReader()
        reader.onload = (e) => {
            const data = new Uint8Array(e.target!.result as ArrayBuffer)
            const workBook = xlsx.read(data, {type: 'array'})
            const sheetName = workBook.SheetNames[0]
            const workSheet = xlsx.utils.sheet_to_json<Partial<worker>>(workBook.Sheets[sheetName])
            setFileData(workSheet)
            console.log(workSheet)
        }
        reader.readAsArrayBuffer(props.file)
    }

    useEffect( () => {
        handleFileUpload()
    }, [] )

    return(
    <div>
        
    </div>
    )
}