'use client'
import { Config } from "@/types/Precios";
import { ChangeEvent, Dispatch, MutableRefObject, RefObject, SetStateAction } from "react";
import XLSX from 'xlsx';

interface HojasProps{
    refConfig:MutableRefObject<Config>;
    setSelectedSheet:Dispatch<SetStateAction<string>>;
    selectedSheet:string;
    xlsxWorker:MutableRefObject<Worker>;
    setDisabled:Function;
    refSelectSheet:RefObject<HTMLSelectElement>;
    xlsxWorkBook:XLSX.WorkBook;
}

const Hojas:React.FC<HojasProps> = ({refConfig,setSelectedSheet,selectedSheet,xlsxWorker,setDisabled,refSelectSheet,xlsxWorkBook})=>{

    const sheetChangeHandler = (event:ChangeEvent<HTMLSelectElement>)=>{
        refConfig.current.xlsxItems = [];
        setSelectedSheet(event.target.value);

        if(event.target.value != 'none'){
            setDisabled();
            xlsxWorker.current.postMessage({task:'sheetToJson',attach:xlsxWorkBook.Sheets[event.target.value]})
        }
    }

    return (
        <>
        <label>hoja</label>
        <select  ref={refSelectSheet} name="sheet" onChange={sheetChangeHandler} value={selectedSheet}>
            <option value="none">hoja</option>
            {xlsxWorkBook.SheetNames.map((name,index)=>(
                <option key={index} value={name}>{name}</option>
                ))}
        </select>
        </>
    )
}

export {Hojas};