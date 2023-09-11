import { useRef,Dispatch,SetStateAction,MutableRefObject } from "react";
import { Config } from "@/types/Precios";
import XLSX from 'xlsx';

interface InitializateXlsxWorkerProps{
    setXlsxWorkBook:Dispatch<SetStateAction<XLSX.WorkBook>>,
    refConfig:MutableRefObject<Config>,
    setEnabled:Function
    xlsxWorker:MutableRefObject<Worker>;
}

const initializateXlsxWorker = ({setXlsxWorkBook,refConfig,setEnabled,xlsxWorker}:InitializateXlsxWorkerProps)=>{

    const initializateWorker = ()=>{
        xlsxWorker.current = new Worker('workers/xlsxWorker.js');        

        xlsxWorker.current.onmessage = (event)=>{
            const {task,attach} = event.data;

            if(task == 'read'){
                const xlsxWorkBook:XLSX.WorkBook = attach;
                setXlsxWorkBook(xlsxWorkBook);
            }

            if(task == 'sheetToJson'){
                const xlsxItems = attach;
                refConfig.current.xlsxItems = xlsxItems;
            }

            setEnabled();
        }
    }

    return {initializateWorker};
}

export {initializateXlsxWorker};