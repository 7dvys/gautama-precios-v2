import { Dispatch, SetStateAction,ChangeEvent, useRef } from "react";

type ColumnasValues = {
    isFinal:number;
    withTitulo:number
}

interface ColumnasProps{
    columnasValues:ColumnasValues;
    setColumnasValues:Dispatch<SetStateAction<ColumnasValues>>
}

const Columnas:React.FC<ColumnasProps> = ({setColumnasValues,columnasValues})=>{
    const inputTituloRef = useRef<HTMLInputElement>(null)

    
    const withTituloChangehandler = (event:ChangeEvent<HTMLSelectElement>)=>{
        const value = event.target.value;
        (inputTituloRef.current as HTMLInputElement).value = '';
        setColumnasValues({...columnasValues,withTitulo:Number(value)});
    }

    const isFinalChangeHandler = (event:ChangeEvent<HTMLSelectElement>)=>{
        const value = event.target.value;
        setColumnasValues({...columnasValues,isFinal:Number(value)});
    }
    
    return (
        <>
            {/* <label>columnas</label> */}
            <label >codigo</label>
            <input type="text" placeholder="columna" name="colCodigo"/>
            <label >costo</label>
            
            <div>
                <input type="text" placeholder="columna" name="colCosto"/>
                <select name="isFinal" onChange={isFinalChangeHandler}>
                    <option value="0">costo</option>
                    <option value="1">final</option>
                </select>
            </div>
            <label >titulo</label>
                
            <div>
                <input ref={inputTituloRef} type="text" placeholder="columna" name="colTitulo" disabled={columnasValues.withTitulo?false:true}/>
                <select onChange={withTituloChangehandler} name="withTitulo">
                    <option value="1">con titulo</option>
                    <option value="0">sin titulo</option>
                </select>
            </div>
        </>
    )
}

export {Columnas}; 