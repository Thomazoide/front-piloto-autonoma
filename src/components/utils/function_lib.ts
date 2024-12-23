import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { worker } from "@/types/worker";
import { beacon } from '@/types/beacon';
import { ingreso } from '@/types/ingreso';
import moment from 'moment'
import { sala } from '@/types/sala';
import { sede } from '@/types/sede';

//(EL NOMBRE ESTA MAL) dada una lista de ingresos, retorna los guardias que han registrado al menos un ingreso dentro de dicha lista
//DEPRECATED
export async function getGuardiasXsala(listaIngresos: ingreso[]): Promise<worker[]>{
    const guardias: worker[] = (await axios.get('http://52.201.181.178:3000/api/guardia')).data
    const beacons: beacon[] = (await axios.get('http://52.201.181.178:3000/api/beacon')).data
    let beaconsPresent: number[] = []
    for(let i of listaIngresos){
        for(let b of beacons){
            if(beaconsPresent.includes(b.id)){
                continue
            }
            if(b.id === i.id_beacon){
                beaconsPresent.push(b.id)
            }
        }
    }
    let guardiasPresentes: worker[] = []
    for(let g of guardias){
        if(beaconsPresent.includes(g.id_beacon)){
            guardiasPresentes.push(g)
        }
    }
    return guardiasPresentes
}

//Dada una lista de ingresos, una fecha inicial y una fecha final, retorna los ingresos registrados dentro del rango de fechas 
export function sortDates(listaIngresos: ingreso[], iDate: Date, fDate: Date): ingreso[]{
    let ingresos: ingreso[] = []
    for(let i of listaIngresos){
        if(new Date(i.hora) > iDate && new Date(i.hora) < fDate){
            ingresos.push(i)
        }
    }
    return ingresos
}

//Dada una lista de ingresos y una fecha, retorna los ingresos registrados en la fecha dada
export function getIngresoByDate(listaIngresos: ingreso[], fecha: Date): ingreso[]{
    const strFecha = fecha.toISOString().slice(0,10)
    const ingresosEnFecha: ingreso[] = []
    for(let i of listaIngresos){
        const strFechaI = new Date(i.hora).toISOString().slice(0,10)
        if(strFecha === strFechaI){
            ingresosEnFecha.push(i)
        }
    }
    return ingresosEnFecha
}

//Dada una lista de ingresos y los datos de un empleado, retorna los ingresos registrados por el empleado
//DEPRECATED, FUNCION YA DISPONIBLE EN EL BACKEND
export function getIngresoByWorker(listaIngresos: ingreso[], empleado: worker): ingreso[]{
    let nuevaListaIngreso: ingreso[] = listaIngresos.filter( (i: ingreso) => i.id_beacon === empleado.id_beacon )
    console.log(nuevaListaIngreso)
    return nuevaListaIngreso
}

//Dada una funcion y un numero(milisegundos), ejecuta la funcion dada pasados los milisegundos dados
export function timeOut(callback: VoidFunction, tiempo: number): void {
    setTimeout(callback, tiempo)
}

export function sortIngresosByHoras(listaIngresos: ingreso[], horaInicio: number[], horaFinal: number[]): ingreso[]{
    const ingresosPorHora: ingreso[] = listaIngresos.filter( (i: ingreso) => {
        const inicio = moment(`${new Date(i.hora).toISOString().slice(0,10)}T${horaInicio[0]}:${horaInicio[1]}:00Z`, 'YYYY-MM-DDTHH:mm:ssZ')
        const final = moment(`${new Date(i.hora).toISOString().slice(0,10)}T${horaFinal[0]}:${horaFinal[1]}:00Z`, 'YYYY-MM-DDTHH:mm:ssZ')
        const fechaMomento = moment(i.hora, 'YYYY-MM-DDTHH:mm:ssZ')
        return fechaMomento.isBetween(inicio, final, null, '(]')
    } )
    return ingresosPorHora
}

export function isDateBetween(fecha: Date): boolean{
    const inicio = moment(new Date()).subtract({hours: 1})
    const final = moment(new Date())
    return moment(fecha).isBetween(inicio, final, null, '(]')
}

export function getLastHourIn(listaIngresos: ingreso[], fecha: Date): (ingreso | undefined)[]{
    const fechaHoraAtras: Date = fecha
    fechaHoraAtras.setHours(fechaHoraAtras.getHours()-1)
    const ingresosFiltrados: (ingreso | undefined)[] = listaIngresos.map( (i: ingreso) => {
        if(new Date(i.hora) >= fechaHoraAtras) return i
    } )
    return ingresosFiltrados
}

export function estuvoUltimaHora(ultimoIngreso?: ingreso): boolean{
    try{if(ultimoIngreso){
        const fechaHoyHoraMenos: Date = new Date()
        const fechaIngreso: Date = new Date(ultimoIngreso.hora)
        fechaIngreso.setHours(fechaIngreso.getHours()+4)
        fechaHoyHoraMenos.setHours(fechaHoyHoraMenos.getHours()-1)

        if(new Date(fechaIngreso.toISOString()).getTime() >= new Date(fechaHoyHoraMenos.toISOString()).getTime()){
            return true
        } else return false
    }}catch(e){return false}
    return false
}

//recibe una fecha y devuelve la hora en formato "HH:MM"
export function obtenerHoradeFecha(fecha: Date): string{
    const hora: string = `${fecha.getHours()+4 < 10 ? "0" : ""}${fecha.getHours()+4}:${fecha.getMinutes() < 10 ? "0" : ""}${fecha.getMinutes()}`
    return hora
}

//recibe una fecha y devuelve la fecha en formato "DD/MM/YYYY"
export function obtenerFechaFormatoI(fecha: Date): string{
    const nuevaFecha: string = `${fecha.getDate() < 10 ? "0":""}${fecha.getDate()}/${fecha.getMonth()+1 < 10 ? "0":""}${fecha.getMonth()+1}/${fecha.getFullYear()}`
    return nuevaFecha
}

export async function getSalasByIngresos(listaIngresos: ingreso[], token: string): Promise<sala[]>{
    const salas: sala[] = []
    for(const ingreso of listaIngresos){
        salas.push( (await axios.post(`${import.meta.env.VITE_API_URL}/sala/gateway`, {
            id: ingreso.id_gateway
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })).data)
    }
    return salas
}

export async function getSedesBySalas(listaSalas: sala[], token: string): Promise<sede[]>{
    const sedes: sede[] = []
    for(const sala of listaSalas){
        sedes.push( (await axios.post(`${import.meta.env.VITE_API_URL}/sedes/findOne`, {
            id: sala.id_sede
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })).data )
    }
    return sedes
}

export function getSedeNameBySala(listaSedes: sede[], salaIngreso?: sala): string | undefined{
    return listaSedes.find( (s: sede) => s.id === salaIngreso?.id_sede )?.nombre
}

export interface MonthAndAttendanceChartData{
    sede: string
    month: string,
    attendances: number,
    numberOfWorkers: number
}

export const MONTHS: string[] = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]

export const MONTHS_NAMES: string[] = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]

export async function SortAttendanceData(sede: sede, token: string, month?: number): Promise<MonthAndAttendanceChartData>{
    const INGRESOS_SEDE_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/ingreso/sede`
    const CONFIG: AxiosRequestConfig<sede> = {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }
    const response: AxiosResponse<ingreso[]> = await axios.post(INGRESOS_SEDE_ENDPOINT, sede, CONFIG)
    const monthValue: number = month != undefined ? month : new Date().getMonth()
    const ingresosOfMonth: ingreso[] = []
    for(let ingreso of response.data){
        if(new Date(ingreso.hora).getMonth() === monthValue){
            ingresosOfMonth.push(ingreso)
        }
    }
    const workersCount: number[] = Array.from(new Set(ingresosOfMonth.map( (i) => i.id_beacon )))
    return {
        sede: sede.nombre,
        month: MONTHS[monthValue],
        attendances: ingresosOfMonth.length,
        numberOfWorkers: workersCount.length
    }
}

export async function GetActiveWorkers(tipo: "guardia" | "docente", token: string): Promise<worker[]>{
    const CONFIG: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const WORKER_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/${tipo}`
    const ACTUAL_TIME_HOUR_LESS = moment(new Date()).subtract({hours: 4})
    const ACTUAL_TIME = moment(new Date())
    const response: AxiosResponse<worker[]> = await axios.get(WORKER_ENDPOINT, CONFIG)
    const activeWorkers: worker[] = []
    for(const worker of response.data){
        if(worker.ubicacion){
            const workerActiveTime = moment(worker.ubicacion.locations[0].timestamp)
            if(workerActiveTime.isBetween(ACTUAL_TIME_HOUR_LESS, ACTUAL_TIME, null, "(]")){
                activeWorkers.push(worker)
            }
        }
    }
    return activeWorkers
}

export async function GetAllSedes(token: string): Promise<sede[]>{
    const SEDES_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/sedes`
    const CONFIG: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response: AxiosResponse<sede[]> = await axios.get(SEDES_ENDPOINT, CONFIG)
    return response.data
}

function calculateAltitude(floor: number, actualAltitude: number): boolean{
    const floorAltitude: number = (floor * 100) + 500
    if((actualAltitude >= floorAltitude) && (actualAltitude <= floorAltitude+70)){
        return true
    }
    return false
}

export async function GetWorkersByAltitude(token: string, workerType: "guardia" | "docente", floor?: number): Promise<worker[]>{
    const WORKERS_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/${workerType}`
    const CONFIG: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const response: AxiosResponse<worker[]> = await axios.get(WORKERS_ENDPOINT, CONFIG)
    const workers: worker[] = response.data
    if(!floor){
        return workers
    }
    const sortedWorkers: worker[] = workers.filter( (w) => w.ubicacion && calculateAltitude(floor, w.ubicacion.locations[0].coords.altitude) )
    return sortedWorkers
}

export interface worker_ingreso{
    worker: worker
    ingresos: ingreso[]
}

export async function getWorkersAndAttendances(token: string, workerType: "guardia" | "docente"): Promise<worker_ingreso[]>{
    const CONFIG: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const WORKER_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/${workerType}`
    const WORKER_ATTENDANCES_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/ingreso/${workerType}`
    const workers: worker[] = (await axios.get<worker[]>(WORKER_ENDPOINT, CONFIG)).data
    const workersAndAttendances: worker_ingreso[] = []
    for(const worker of workers){
        const ingresos: ingreso[] = (await axios.post<ingreso[]>(WORKER_ATTENDANCES_ENDPOINT, worker, CONFIG)).data
        workersAndAttendances.push({
            worker,
            ingresos
        })
    }
    return workersAndAttendances
}

export async function getAllSalas(token: string): Promise<sala[]>{
    const CONFIG: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const SALAS_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/sala`
    const salas: sala[] = (await axios.get<sala[]>(SALAS_ENDPOINT, CONFIG)).data
    return salas
}

//RETORNA LAS SALAS DE UNA SEDE ENTREGADA COMO ARGUMENTO JUNTO CON EL TOKEN DE ACCESO
export async function getSalasBySede(sede: sede, token: string): Promise<sala[]>{
    const CONFIG: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    const SALAS_ENDPOINT: string = `${import.meta.env.VITE_API_URL}/sala/sede`
    const response: AxiosResponse<sala[]> = await axios.post(SALAS_ENDPOINT, sede, CONFIG)
    return response.data
}

//RETORNA UNA LISTA CON LOS AÑOS DE LOS QUE TIENE REGISTRO LA LISTA DE INGRESOS ENTREGADA COMO PARÁMETRO
export function GetYearsFromAttendanceList(ingresos: ingreso[]): Array<number>{
    const yearListUnordered: Array<number> = []
    for(let ingreso of ingresos){
        yearListUnordered.push(new Date(ingreso.hora).getFullYear())
    }
    return Array.from(new Set(yearListUnordered))
}

//RETORNA UNA LISTA DE INGRESOS SEGUN EL AÑO Y EL MES ENTREGADO COMO PARAMETRO
export function SortAttendancesByMonthAndYear(attendances: ingreso[], month: number, year: number): ingreso[]{
    const newAttendances: ingreso[] = []
    for(let attendance of attendances){
        if((new Date(attendance.hora).getMonth() === month) && (new Date(attendance.hora).getFullYear() === year)){
            console.log(new Date(attendance.hora).getMonth())
            newAttendances.push(attendance)
        }
    }
    return newAttendances
}

//RETORNA EL NUMERO DE SEMANAS DE UN MES SEGUN EL AÑOY EL MES ENTREGADO COMO PARÁMETRO
export function GetWeeksOfMonth(year: number, month: number): string[]{
    const start = moment([year, month])
    const weeks = Math.ceil(start.daysInMonth()/7)
    const weekList: string[] = []
    for(let i = 1 ; i <= weeks ; i++){
        weekList.push(`semana ${i}`)
    }
    return weekList
}

export interface weekAttendance{
    week: number
    ingresos: ingreso[]
}

//RETORNA UNA LISTA DE INGRESOS AGRUPADOS POR SEMANA DEL MES, ASUMIENDO QUE LA LISTA YA ENTREGA UNA LISTA DE INGRESOS ORDENADAS DENTRO DE UN MES ESPECIFICO
export function SortAttendancesByWeeks(attendances: ingreso[]): Array<weekAttendance>{
    const groupedAttendances: Array<{week: number, ingresos: ingreso[]}> = []
    attendances.forEach( att => {
        const objDate = moment(att.hora)
        const weekNumber = objDate.week()
        console.log(weekNumber)
        if(!groupedAttendances.find( g => g.week === weekNumber )){
            groupedAttendances.push({week: weekNumber, ingresos: []})
        }
        groupedAttendances.find( g => g.week === weekNumber )!.ingresos.push(att)
    } )
    return groupedAttendances
}

export function GetSalaByAttendance(attendance: any,  salas: any[]): sala{
    return salas.filter( (s) => s.id_gateway === attendance.id_gateway )[0]
}

export async function GetAllDocentes(token: string): Promise<worker[]> {
    const ENDPOINT: string = `${import.meta.env.VITE_API_URL}/docente`
    const CONFIG: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    return (await axios.get(ENDPOINT, CONFIG)).data
}

export function GetActiveDocentes(docentes: worker[]): number {
    let active: number = 0
    docentes.forEach( (docente) => docente.ubicacion ?? active++)
    return active
}

export async function GetActiveRooms(token: string): Promise<number> {
    const salas: sala[] = await getAllSalas(token)
    return salas.length
}
