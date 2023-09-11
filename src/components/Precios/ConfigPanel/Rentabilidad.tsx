import { Dispatch, SetStateAction,ChangeEvent, useRef } from "react";

type RentabilidadValues = {
    isFinal:number;
}

interface RentabilidadProps{
    rentabilidadValues:RentabilidadValues;
    setRentabilidadValues:Dispatch<SetStateAction<RentabilidadValues>>
}

const Rentabilidad:React.FC<RentabilidadProps> = ({setRentabilidadValues,rentabilidadValues})=>{
    const inputRentabilidadRef = useRef<HTMLInputElement>(null)
    
    const changeHandler = (event:ChangeEvent<HTMLSelectElement>)=>{
        (inputRentabilidadRef.current as HTMLInputElement).value = '';
        setRentabilidadValues({isFinal:Number(event.target.value)});
    }
    
    return (
        <>
            <label>rentabilidad</label>
            <div>
                <input ref={inputRentabilidadRef} type="number" name="rentabilidad" disabled={rentabilidadValues.isFinal?true:false}/>
                <select name="isFinal" onChange={changeHandler}  value={rentabilidadValues.isFinal} >
                    <option value="0">con rentabilidad</option>
                    <option value="1">sin rentabilidad</option>
                </select>
            </div>
        </>

    )
}

export {Rentabilidad}; 