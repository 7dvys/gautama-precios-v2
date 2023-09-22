import {LOCALSTORAGE_KEYS} from '@/constants';

const initializeCotizaciones  = async()=>{

    const getCotizaciones = ():Record<string,number>=>{
        if(!typeof localStorage.getItem(LOCALSTORAGE_KEYS.cotizaciones) !== undefined)
        return JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.cotizaciones)??'{}')
        else return {}
    }
    const updateCotizacion = ({title,value}:{title:string,value:number})=>{
        const cotizacion = getCotizaciones()
        cotizacion[title] = value;
        localStorage.setItem(LOCALSTORAGE_KEYS.cotizaciones,JSON.stringify(cotizacion))
        return getCotizaciones();
    }

    const removeCotizacion = ({title}:{title:string})=>{
        const cotizaciones = getCotizaciones()
        const newCotizaciones = Object.entries(cotizaciones).reduce((acc,[key,value])=>{
            if(key != title)
            acc[key] = value
            return acc
        },{} as Record<string,number>)
        localStorage.setItem(LOCALSTORAGE_KEYS.cotizaciones,JSON.stringify(newCotizaciones))
        return getCotizaciones();
    }

    const apiDolares = await fetch('https://dolarapi.com/v1/dolares');

    if(apiDolares.ok){
        const cotizacionesJson = await apiDolares.json();
        const blue = cotizacionesJson.filter((cotizacion:{casa:string,})=>(cotizacion.casa == 'blue'))[0]
        const oficial = cotizacionesJson.filter((cotizacion:{casa:string,})=>(cotizacion.casa == 'oficial'))[0]
        updateCotizacion({title:'blue',value:blue.venta})
        updateCotizacion({title:'oficial',value:oficial.venta})
    }

    return {getCotizaciones,updateCotizacion,removeCotizacion}
}

export {initializeCotizaciones};