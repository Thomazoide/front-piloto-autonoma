import { ingreso } from "@/types/ingreso";
import moment from "moment";
import { ReactElement, useState } from "react";
import { GetSalaByAttendance, getSedeNameBySala } from "../utils/function_lib";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { sede } from "@/types/sede";
import { sala } from "@/types/sala";
import { EventClickArg } from "@fullcalendar/core/index.js";
import ModalInfo from "./modalInfo";

interface CVProps{
    sedes: sede[]
    salas: sala[]
    month: number
    year: number
    events: Array<{
        title: string 
        date: string 
        data: ingreso
    }>
}

export default function CalendarView(props: Readonly<CVProps>): ReactElement{
    const [showModal, setShowModal] = useState<boolean>(false)
    const [modalInfo, setModalInfo] = useState<{
        sede: string
        sala: string
    }>()
    function handleEventClick(info: EventClickArg){
        const attendance: ingreso | undefined = props.events.find( (e) => new Date(e.data.hora).toISOString() === info.event.title )?.data
        const salaName: sala = GetSalaByAttendance(attendance!, props.salas)
        const sedeName: string | undefined = getSedeNameBySala(props.sedes, salaName)
        setModalInfo({
            sede: sedeName!,
            sala: salaName.numero
        })
        setShowModal(true)
    }
    return (
        <div className="flex flex-grow justify-center h-full w-[100dvh] p-[15px]">
            { modalInfo && <ModalInfo show={showModal} sala={modalInfo.sala} sede={modalInfo.sede} setShow={setShowModal} />}
            <FullCalendar
            headerToolbar={{
                center: 'title',
                left: '          ',
                right: '          '
            }}
            allDayClassNames={["flex justify-center w-fit -h-fit"]}
            handleWindowResize={true}
            height={"500px"}
            initialDate={moment(`01-${props.month+1}-${props.year}`, "DD-MM-YYYY").toISOString()}
            plugins={[dayGridPlugin, interactionPlugin]}
            locale="es"
            timeZone="America/Santiago"
            eventClick={handleEventClick}
            events={props.events}
            weekNumbers/>
        </div>
    )
}