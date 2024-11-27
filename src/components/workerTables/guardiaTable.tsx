import { ChangeEvent, ReactElement, useEffect, useMemo, useState } from "react";
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
    MRT_GlobalFilterTextField,
    MRT_ToggleFiltersButton
} from 'material-react-table';
import {
    Box,
    ListItemIcon,
    MenuItem,
    Typography
} from '@mui/material'
import { Edit32Regular, Delete32Regular, ArrowClockwiseDashes16Regular } from "@fluentui/react-icons";
import { worker_ingreso } from "../utils/function_lib";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { sede } from "@/types/sede";
import { sala } from "@/types/sala";
import EditWorkerModal from "../utils/editWorkerModal";
import { worker } from "@/types/worker";
import DeleteWorkerModal from "../utils/deleteWorkerModal";
import WorkerInfo from "./workerInfo";
import { Button } from "@nextui-org/button";
import AddWorkerModal from "../utils/addWorkerModal";
import { Form } from "react-bootstrap";
import XlsxReader from "../utils/xlsxReader";

interface GTProps {
    listaGuardias: worker_ingreso[]
    workerType: "guardia" | "docente"
    salas: sala[]
    sedes: sede[]
    token: string
    isAdmin: boolean
    refetch: () => Promise<void>
}

export default function GuardiaTable(props: Readonly<GTProps>): ReactElement {
    const [listaGuardias, setListaGuardias] = useState<worker_ingreso[]>([])
    const [selectedEntity, setSelectedEntity] = useState<worker>()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
    const [showModal, setShowModal] = useState<boolean>(false)
    const [isFileTypeValid, setIsFileTypeValid] = useState<boolean>(false)
    const [archivo, setArchivo] = useState<Blob>()

    const checkFileType = function (e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.item(0)
        if(file){
            if(file.type === 'text/csv'){
                setIsFileTypeValid(true)
                setArchivo(new Blob([file], {type: file.type}))
                return
            }
            if(file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'){
                setIsFileTypeValid(true)
                setArchivo(new Blob([file], {type: file.type}))
                return
            }
            setIsFileTypeValid(false)
            alert("tipo de archivo invalido")
        }
    }

    const columns = useMemo<MRT_ColumnDef<worker_ingreso>[]>(
        () => [
            {
                id: props.workerType,
                header: `${props.workerType === "docente" ? "D" : "G"}${props.workerType.slice(1)}s`,
                columns: [
                    {
                        accessorKey: 'worker.nombre',
                        id: 'nombre',
                        header: 'Nombre',
                        size: 250
                    },
                    {
                        accessorKey: 'worker.rut',
                        header: 'Rut',
                        enableClickToCopy: true,
                        size: 250
                    },
                    {
                        accessorKey: 'worker.email',
                        header: 'Email',
                        size: 250
                    },
                    {
                        accessorKey: 'worker.celular',
                        header: 'Celular',
                        size: 250
                    }
                ]

            }
        ], [])
    const table = useMaterialReactTable({
        columns,
        data: listaGuardias,
        enableColumnFilterModes: true,
        enableColumnOrdering: true,
        enableGrouping: true,
        enableColumnPinning: true,
        enableFacetedValues: true,
        enableRowActions: true,
        initialState: {
            showColumnFilters: true,
            showGlobalFilter: true,
            columnPinning: {
                left: ['mrt-row-expand', 'mrt-row-select'],
                right: ['mrt-row-actions']
            }
        },
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'top',
        muiSearchTextFieldProps: {
            size: 'small',
            variant: 'outlined'
        },
        muiPaginationProps: {
            color: 'standard',
            rowsPerPageOptions: [10, 20, 30],
            shape: 'rounded',
            variant: 'outlined'
        },
        renderDetailPanel: ({ row }) => (
            <Box>
                <div className="flex justify-evenly p-[15px] w-full h-fit">
                    <Typography variant="h4">
                        Registro de ingresos
                    </Typography>
                </div>
                <WorkerInfo entity={row.original} sedes={props.sedes} salas={props.salas} />
            </Box>
        ),
        renderRowActionMenuItems: ({ closeMenu, row }) => (
            [
                <MenuItem key={0} onClick={() => {
                    setSelectedEntity(row.original.worker)
                    setIsOpen(true)
                    closeMenu()
                }} disabled={!props.isAdmin} >
                    <ListItemIcon>
                        <Edit32Regular />
                    </ListItemIcon>
                    Editar
                </MenuItem>,
                <MenuItem key={1} onClick={() => {
                    setSelectedEntity(row.original.worker)
                    setIsDeleteOpen(true)
                    closeMenu()
                }} disabled={!props.isAdmin} >
                    <ListItemIcon>
                        <Delete32Regular />
                    </ListItemIcon>
                    Eliminar
                </MenuItem>
            ]
        ),
        renderTopToolbar: ({ table }) => (
            <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingLeft: '100px', paddingTop: '15px' }}>
                <MRT_GlobalFilterTextField table={table} />
                <MRT_ToggleFiltersButton table={table} />
                <div className="flex flex-row gap-3 w-full justify-end pr-[150px] ">
                    <Button color="danger" onPress={ () => setShowModal(true) } >
                        Crear {props.workerType}
                    </Button>
                    <div className="flex flex-col items-center border-1 border-solid border-danger-300 p-[10px] rounded-lg ">
                        <p>Cargar desde archivo</p>
                        <Form.Control type="file" size="sm" onChange={checkFileType} accept=".csv,.xlsx" />
                    </div>
                    <Button startContent={
                        <ArrowClockwiseDashes16Regular/>
                    } onPress={props.refetch} color="danger">
                        Actualizar
                    </Button>
                </div>
            </Box>
        )
    })
    useEffect(() => {
        setListaGuardias(props.listaGuardias)
    }, [])
    return (
        <LocalizationProvider>
            <XlsxReader file={archivo!} showModal={isFileTypeValid} setShowModal={setIsFileTypeValid} token={props.token}/>
            <AddWorkerModal token={props.token} showModal={showModal} setShowModal={setShowModal} tipo={props.workerType} refetch={props.refetch}/>
            <DeleteWorkerModal token={props.token} entity={selectedEntity!} isOpen={isDeleteOpen} workerType={props.workerType} setIsOpen={setIsDeleteOpen} refetch={props.refetch} />
            <EditWorkerModal token={props.token} entity={selectedEntity!} isOpen={isOpen} workerType={props.workerType} setIsOpen={setIsOpen} refetch={props.refetch} />
            <MaterialReactTable table={table} />
        </LocalizationProvider>
    )
}