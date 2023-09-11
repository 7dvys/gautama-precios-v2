'use client'

import { ChangeEvent, useRef } from "react"

const Opciones:React.FC = ()=>{
    
    const opciones = useRef<Record<string,string>>({
        cbUser:localStorage.getItem('cbUser')??'',
        cbPass:'',
        mailUser:localStorage.getItem('mailUser')??'',
        mailPass:'',
    })

    const changeHandler = (event:ChangeEvent<HTMLInputElement>)=>{
        opciones.current[event.target.name] = event.target.value ??"";
    }

    const updateOpciones = ()=>{
        Object.entries(opciones.current).forEach(([key,value])=>{
            const defaultValue = localStorage.getItem(key)??""
            localStorage.setItem(key,value??defaultValue);   
        })
    }

    return (
        <div className="box formBox" onChange={changeHandler}>
            <label>Contabilium</label>
            <input name="cbUser" type="text" placeholder="usuario" defaultValue={opciones.current.cbUser}/>
            <input name="cbPass" type="password" placeholder="password"/>
            <label>Correo Electronico</label>
            <input name="mailUser" type="text" placeholder="usuario" defaultValue={opciones.current.mailUser}/>
            <input name="mailPass" type="password" placeholder="password"/>
            <div>
                <button onClick={updateOpciones}>aceptar</button>
            </div>
            
        </div>
    )
}

export default Opciones