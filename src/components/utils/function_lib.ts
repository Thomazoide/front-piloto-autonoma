import axios from 'axios'
import { worker } from "@/types/worker";
import { beacon } from '@/types/beacon';
import { ingreso } from '@/types/ingreso';

//(EL NOMBRE ESTA MAL) dada una lista de ingresos, retorna los guardias que han registrado al menos un ingreso dentro de dicha lista
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

export function sortIngresosByHoras(listaIngresos: ingreso[], horaInicio: number[]): ingreso[]{
    const ingresosPorHora: ingreso[] = []
    for(let i of listaIngresos){
        let horas: number = new Date(i.hora).getHours()+4
        let minutos: number = new Date(i.hora).getMinutes()
        if(horas >= horaInicio[0] && minutos >= horaInicio[1]){
            ingresosPorHora.push(i)
        }
    }
    return ingresosPorHora
}

export function sortIngresosByHoraFinal(listaIngresos: ingreso[], horaFinal: number[]): ingreso[]{
    const ingresosPorHoraFinal: ingreso[] = []
    for(let i of listaIngresos){
        let horas: number = new Date(i.hora).getHours()+4
        let minutos: number = new Date(i.hora).getMinutes()
        console.log(`Hora ingreso: ${horas} | Hora de filtro: ${horaFinal[0]}`)
        if( horaFinal[0] >= horas && horaFinal[1] >= minutos ){
            console.log(i)
            ingresosPorHoraFinal.push(i)
        }
    }
    return ingresosPorHoraFinal
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
    const nuevaFecha: string = `${fecha.getDate() < 10 ? "0":""}${fecha.getDate()}/${fecha.getMonth() < 10 ? "0":""}${fecha.getMonth()}/${fecha.getFullYear()}`
    return nuevaFecha
}