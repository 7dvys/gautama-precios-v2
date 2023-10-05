import { PotentialMatches } from "@/types/descubrir/PotentialMatches";
import { MutableRefObject } from "react";
import XLSX from 'xlsx';

interface InitializateWorkerProps{
    readCallback:(xlsxWorkBook:XLSX.WorkBook)=>void;
    sheetToJsonCallback:(xlsxItems:any)=>void;
    onMessageCallback:()=>void;
    discoverProductsCallback?:(potentialMatches:PotentialMatches)=>void;
}

const initializateXlsxWorker = ({xlsxWorker}:{xlsxWorker:MutableRefObject<Worker>;})=>{

    const initializateWorker= ({readCallback,sheetToJsonCallback,onMessageCallback,discoverProductsCallback}:InitializateWorkerProps)=>{
        xlsxWorker.current = new Worker('workers/xlsxWorker.js');        

        xlsxWorker.current.onmessage = (event)=>{
            const {task,attach} = event.data;

            if(task == 'read'){
                const xlsxWorkBook:XLSX.WorkBook = attach;
                readCallback(xlsxWorkBook);
            }

            if(task == 'sheetToJson'){
                const xlsxItems = attach;
                sheetToJsonCallback(xlsxItems);
            }

            if(task == 'discoverProducts'){
                const potentialMatches:PotentialMatches = attach
                if(discoverProductsCallback) discoverProductsCallback(potentialMatches)
            }

            onMessageCallback();
        }
    }

    return {initializateWorker};
}

export {initializateXlsxWorker};