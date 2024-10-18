import { ReactElement, useEffect, useMemo, useState } from "react";
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
import { Edit32Regular, Delete32Regular, Calendar24Regular } from "@fluentui/react-icons";
import { worker_ingreso } from "../utils/function_lib";
import { LocalizationProvider } from "@mui/x-date-pickers";
import FilterIngresosWorker from "../filterIngresosWorker";
import { sede } from "@/types/sede";
import { sala } from "@/types/sala";

interface GTProps{
    listaGuardias: worker_ingreso[]
    workerType: "guardia" | "docente"
    salas: sala[]
    sedes: sede[]
}

export default function GuardiaTable(props: Readonly<GTProps>): ReactElement{
    const [listaGuardias, setListaGuardias] = useState<worker_ingreso[]>([])
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
        renderDetailPanel: ({row}) => (
            <Box>
                <div className="flex justify-evenly p-[15px] w-full h-[150px]">
                    <Typography variant="h4">
                        Ingresos
                    </Typography>
                </div>
                <FilterIngresosWorker entity={row.original} salas={props.salas} sedes={props.sedes}/>
            </Box>
        ),
        renderRowActionMenuItems: ({closeMenu}) => (
            [
            <MenuItem key={0} onClick={ () => closeMenu() }>
                <ListItemIcon>
                    <Edit32Regular/>
                </ListItemIcon>
                Editar
            </MenuItem>,
            <MenuItem key={1} onClick={ () => closeMenu() }>
                <ListItemIcon>
                    <Delete32Regular/>
                </ListItemIcon>
                Eliminar
            </MenuItem>
            ]
        ),
        renderTopToolbar: ({table}) => (
            <Box sx={{display: 'flex', gap: '1rem', alignItems: 'center', paddingLeft: '100px', paddingTop: '15px'}}>
                <MRT_GlobalFilterTextField table={table}/>
                <MRT_ToggleFiltersButton table={table}/>
            </Box>
        )
    })
    useEffect( () => {
        setListaGuardias(props.listaGuardias)
    }, [] )
    return (
        <LocalizationProvider>
            <MaterialReactTable table={table}/>
        </LocalizationProvider>
    )
}