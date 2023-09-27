'use client'
import { ChangeEvent, RefObject, useRef } from "react";


interface ColumnasProps{
    columnaCodigoRef:RefObject<HTMLInputElement>
    columnaCostoRef:RefObject<HTMLInputElement>
    isFinalRef:RefObject<HTMLSelectElement>
    columnaTituloRef:RefObject<HTMLInputElement>
    withTituloRef:RefObject<HTMLSelectElement>

}

const Columnas:React.FC<ColumnasProps> = ({columnaCodigoRef,columnaCostoRef,columnaTituloRef,isFinalRef,withTituloRef})=>{

    const withTituloChangehandler = (event:ChangeEvent<HTMLSelectElement>)=>{
        if(!Number(event.target.value)){
            (columnaTituloRef.current as HTMLInputElement).value = '';
            (columnaTituloRef.current as HTMLInputElement).disabled = true;
        } else (columnaTituloRef.current as HTMLInputElement).disabled = false;

    }
    
    return (
        <>
            <label >codigo</label>
            <input ref={columnaCodigoRef} type="text" placeholder="columna" name="colCodigo"/>
            
            <label >costo</label>
            <div>
                <input ref={columnaCostoRef} type="text" placeholder="columna" name="colCosto"/>
                <select  ref={isFinalRef} name="isFinal">
                    <option value="0">costo</option>
                    <option value="1">final</option>
                </select>
            </div>
                
            <label >titulo</label>
            <div>
                <input ref={columnaTituloRef} type="text" placeholder="columna" name="colTitulo"/>
                <select ref={withTituloRef} onChange={withTituloChangehandler} name="withTitulo">
                    <option value="1">con titulo</option>
                    <option value="0">sin titulo</option>
                </select>
            </div>
        </>
    )
}

export {Columnas}; 