'use client'

import { Products } from "@/types/Precios";
import { XlsxItems } from "@/types/descubrir/Config";
import { PotentialMatches } from "@/types/descubrir/PotentialMatches";
import { letterToNumber } from "@/utils";
import { initializateXlsxWorker } from "@/utils/xlsx/initializateWorker";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import * as XLSX from 'xlsx';



const ConfigPanel:React.FC<{setPotentialMatches:Dispatch<SetStateAction<PotentialMatches>>,products:Products}> = ({setPotentialMatches,products})=>{
    const xlsxWorker = useRef<Worker>({} as Worker);
    const [xlsxWorkBook,setXlsxWorkBook] = useState<XLSX.WorkBook>({SheetNames:[] as string[]} as XLSX.WorkBook)
    const {initializateWorker} = initializateXlsxWorker({xlsxWorker});

    useEffect(()=>{
        const readCallback = (xlsxWorkBook:XLSX.WorkBook)=>{setXlsxWorkBook(xlsxWorkBook)};
        const sheetToJsonCallback = (xlsxItems:any)=>{xlsxItemsRef.current = xlsxItems};
        const onMessageCallback = ()=>{setEnabled()};
        const discoverProductsCallback = (potentialMatches:PotentialMatches)=>{
            setPotentialMatches(potentialMatches)
        }
        initializateWorker({readCallback,sheetToJsonCallback,onMessageCallback,discoverProductsCallback});
    },[])
    
    const fileRef = useRef<HTMLInputElement>(null)
    const codigoRef = useRef<HTMLInputElement>(null)
    const tituloRef = useRef<HTMLInputElement>(null)
    const sheetRef = useRef<HTMLSelectElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const xlsxItemsRef = useRef<string[][]>([]);

    const setEnabled = ()=>{
        (buttonRef.current as HTMLButtonElement).disabled = false;
    }

    const setDisabled = ()=>{
        (buttonRef.current as HTMLButtonElement).disabled = true;
    }

    const discoverHandler = ()=>{
        let error = '';
        const colCodigo = letterToNumber((codigoRef.current as HTMLInputElement).value);
        const colTitulo = letterToNumber((tituloRef.current as HTMLInputElement).value);
        if(!colCodigo || !colTitulo) error += '[!] Debes completar todas las columnas.\n';
        if(!xlsxItemsRef.current.length) error += '[!] Coloca una hoja valida.';

        if(!error){
            const xlsxItems = xlsxItemsRef.current.reduce((xlsxItems,currentItem)=>{
                xlsxItems.push({
                    codigo:currentItem[colCodigo-1],
                    titulo:currentItem[colTitulo-1]
                })
                return xlsxItems;
            },[] as XlsxItems)

            setDisabled()
            xlsxWorker.current.postMessage({task:'discoverProducts',attach:{xlsxItems,products}});
        } else alert(error)
    }

    const fileChangeHandler = (event:ChangeEvent<HTMLInputElement>)=>{
        const files = (event as ChangeEvent<HTMLInputElement>).target.files;
        if (files){
            setDisabled();
            xlsxWorker.current.postMessage({task:'read',attach:(files as FileList)[0]});
        }
    }

    const sheetChangeHandler = (event:ChangeEvent<HTMLSelectElement>)=>{
        if(event.target.value != 'none'){
            setDisabled();
            xlsxWorker.current.postMessage({task:'sheetToJson',attach:xlsxWorkBook.Sheets[event.target.value]})
        }
    }
    
    return (
        <aside className="formBox box">
            <h3>Descubrir productos</h3>
            <label>archivo</label>
            <input onChange={fileChangeHandler} ref={fileRef} type="file"/>
            <label>hoja</label>
            <select onChange={sheetChangeHandler} ref={sheetRef}>
                <option value="none">hoja</option>
                {xlsxWorkBook.SheetNames.map(sheetName=>(
                    <option key={sheetName} value={sheetName}>{sheetName}</option>
                ))}
            </select>
            <label>columnas</label>
            <div>
                <input ref={codigoRef} type="text" placeholder="codigo"/>
                <input ref={tituloRef} type="text" placeholder="titulo"/>
            </div>
            <div>
                <button ref={buttonRef} onClick={discoverHandler}>descubrir</button>
            </div>
        </aside>
    )
}

export {ConfigPanel};