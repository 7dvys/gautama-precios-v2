'use client'

import { ChangeEvent, useRef } from "react"

const Opciones:React.FC = ()=>{
    
    const isClient = typeof window !== 'undefined';
    
    const opciones = useRef<Record<string,string>>({
        cbUser:isClient?localStorage.getItem('cbUser')??'':'',
        cbPass:'',
        mailUser:isClient?localStorage.getItem('mailUser')??'':'',
        mailPass:'',
    })

    const changeHandler = (event:ChangeEvent<HTMLInputElement>)=>{
        opciones.current[event.target.name] = event.target.value ??"";
    }

    const updateOpciones = ()=>{
        if (isClient)
        Object.entries(opciones.current).forEach(([key,value])=>{
            const defaultValue = localStorage.getItem(key)??""
            localStorage.setItem(key,value??defaultValue);   
        })
    }

    return (
        <section className="" onChange={changeHandler}>
            <h3>hola</h3>
            <div className="formBox box">

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
            
        </section>
    )
}

export default Opciones