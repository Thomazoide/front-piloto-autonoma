import { useState, ReactElement, ChangeEvent, MouseEvent } from 'react';
import { GetYearsFromAttendanceList, MONTHS, SortAttendancesByMonthAndYear, timeOut, worker_ingreso } from '../utils/function_lib';
import { sala } from '@/types/sala';
import { sede } from '@/types/sede';
import { Button, Select, SelectItem, SelectSection, ButtonGroup, Spinner } from '@nextui-org/react';
import { ingreso } from '@/types/ingreso';
import CalendarView from './calendarView';
import moment from 'moment-timezone';

interface WIProps{
    entity: worker_ingreso
    salas: sala[]
    sedes: sede[]
}

export default function WorkerInfo(props: Readonly<WIProps>): ReactElement{
    const [selectedYear, setSelectedYear] = useState<number>()
    const [selectedMonth, setSelectedMonth] = useState<string>()
    const [monthValue, setMonthValue] = useState<number>()
    const [sortedAttendances, setSortedAttendances] = useState<ingreso[]>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const yearList: Array<number> = GetYearsFromAttendanceList(props.entity.ingresos)

    function handleYearSelect(e: ChangeEvent<HTMLSelectElement>){
        setSelectedYear(Number(e.target.value))
    }

    function handleMonthSelect(e: MouseEvent<HTMLButtonElement> ){
        setIsLoading(true)
        const [month, monthValue] = e.currentTarget.value.split('_')
        setSelectedMonth(month)
        setMonthValue(Number(monthValue))
        const auxSortedAttendances: ingreso[] = SortAttendancesByMonthAndYear(props.entity.ingresos, Number(monthValue), selectedYear!)
        console.log(auxSortedAttendances)
        setSortedAttendances(auxSortedAttendances)
        timeOut( () => {setIsLoading(false)}, 100 )
    }

    if(!props.entity.ingresos[0]){
        return (
            <div className="flex justify-center w-full h-full p-[15px]">
                <h4>Sin resgistros...</h4>
            </div>
        )
    }
    return (
        <div className="flex flex-col items-center p-[15px] w-full h-full">
            <div id="year-select" className="flex justify-start w-full h-fit">
                <Select label="Seleccionar año" variant="underlined" className='max-w-[250px]' selectionMode='single' value={selectedYear} onChange={handleYearSelect} >
                    <SelectSection>
                    {
                        yearList.map( (year) => (
                            <SelectItem key={year} value={year} id={String(year)} textValue={String(year)} >
                                {year}
                            </SelectItem>
                        ) )
                    }
                    </SelectSection>
                </Select>
            </div>
            <hr/>
            <div id="month-select" className="flex flex-row w-full gap-3 justify-between p-[15px] h-fit">
                { selectedYear && 
                <ButtonGroup color='danger' size="md" className="w-fit" title='Seleccionar mes' >
                    {
                        MONTHS.map( (month, index) => (
                            <Button key={month} isDisabled={month === selectedMonth} value={`${month}_${index}`} onClick={handleMonthSelect} >
                                {month}
                            </Button>
                        ) )
                    }
                </ButtonGroup>
                }
            </div>
            <div id="week-view" className="flex gap-2 w-[100%] p-[15px]">
                {
                    isLoading ?
                    <Spinner color="danger" label="Cargando..."/>
                    :
                    sortedAttendances && !isLoading &&
                    <div id="selected-week-view" className="flex flex-grow h-fit w-full  justify-center p-[15px]">
                        <CalendarView events={Array.from(sortedAttendances.map( (week) => {
                            return {
                                title: new Date(week.hora).toISOString(),
                                date: moment(week.hora).toISOString(),
                                data: week
                            }
                        } ))} month={monthValue!} year={selectedYear!} salas={props.salas} sedes={props.sedes} />
                    </div>
                }
            </div>
        </div>
    )
}