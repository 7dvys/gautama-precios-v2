import { Dispatch, SetStateAction,ChangeEvent, useRef } from "react";

type TituloValues = {
    tieneTitulo:number;
}

interface ColumnasProps{
    tituloValues:TituloValues;
    setTituloValues:Dispatch<SetStateAction<TituloValues>>
}

const Columnas:React.FC<ColumnasProps> = ({setTituloValues,tituloValues})=>{
    const inputTituloRef = useRef<HTMLInputElement>(null)
    
    const changeHandler = (event:ChangeEvent<HTMLSelectElement>)=>{
        (inputTituloRef.current as HTMLInputElement).value = '';
        setTituloValues({tieneTitulo:Number(event.target.value)});
    }
    
    return (
        <>
            <label>columnas</label>
            <div>
                <input type="text" placeholder="codigo" name="colCodigo"/>
                <input type="text" placeholder="costo" name="colCosto"/>
                <input ref={inputTituloRef} type="text" placeholder="titulo" name="colTitulo" disabled={tituloValues.tieneTitulo?false:true}/>
                <select onChange={changeHandler} name="tieneTitulo">
                    <option value="1">con titulo</option>
                    <option value="0">sin titulo</option>
                </select>
            </div>
        </>
    )
}

export {Columnas}; 