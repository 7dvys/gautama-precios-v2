'use client'
import { useRef,useEffect, useState, ChangeEvent, } from "react";
import { ConfigPanelProps,Config } from "@/types/Precios";
import { initializateXlsxWorker } from "@/utils/precios/configPanel";
import { Proveedores,Hojas, Columnas, Cotizaciones } from "@/components/Precios/ConfigPanel";
import { useManageDisabled } from "@/hooks/useManageDisabled";
import { letterToNumber } from "@/utils";
import { ACCOUNT_TYPE, LOCALSTORAGE_KEYS } from "@/constants";
import * as XLSX from 'xlsx';
import { InformationPanel } from "../InformationPanel";

const ConfigPanel:React.FC<ConfigPanelProps> = ({config,setConfig,vendors,products})=>{

    const [xlsxWorkBook,setXlsxWorkBook] = useState<XLSX.WorkBook>({SheetNames:[] as string[]} as XLSX.WorkBook);
    const refConfig = useRef<Config>(config);

    const {refAceptButton,refInputFile,refSelectSheet,setDisabled,setEnabled} = useManageDisabled()

    const accountType = typeof window != 'undefined'?localStorage.getItem(LOCALSTORAGE_KEYS.accountType):ACCOUNT_TYPE.main;
    
    const xlsxWorker = useRef<Worker>({} as Worker);
    const {initializateWorker} = initializateXlsxWorker({setXlsxWorkBook,refConfig,setEnabled,xlsxWorker});

    const cotizacionRef = useRef<HTMLSelectElement>(null);
    const vendorRef = useRef<HTMLSelectElement>(null);
    const vendorFilterRef = useRef<HTMLSelectElement>(null);
    const ivaRef = useRef<HTMLInputElement>(null)
    const ivaIncludedRef = useRef<HTMLSelectElement>(null);
    const columnaCodigoRef = useRef<HTMLInputElement>(null)
    const columnaCostoRef = useRef<HTMLInputElement>(null)
    const isFinalRef = useRef<HTMLSelectElement>(null);
    const columnaTituloRef = useRef<HTMLInputElement>(null)
    const withTituloRef = useRef<HTMLSelectElement>(null);
    const modifyRef = useRef<HTMLInputElement>(null)
    const modifyAffectRef = useRef<HTMLSelectElement>(null);
    const profitRef = useRef<HTMLInputElement>(null)

    const setConfigRef = (array:{name:string,value:string}[])=>{
        array.forEach(element=>{
            const {name,value}= element as {name:string,value:string}
            
            if (name in refConfig.current && name != 'cotizacion' && name != 'xlsxItems')
            refConfig.current[name as keyof Omit<Omit<Config,'cotizacion'>,'xlsxItems'>] = (name == 'colCodigo' || name == 'colCosto' || name =='colTitulo')?letterToNumber(value):Number(value);

            if(name == 'cotizacion')
            refConfig.current[name] = value;
        });
    }
    
    const confirmHandler = ()=>{
        let error = '';
        if(!refConfig.current.xlsxItems.length)
        error += '[!] Tu hoja no tiene items: coloca una hoja valida.\n\n';

        if(!Number((vendorRef.current as HTMLSelectElement).value))
        error += '[!] Coloca un proveedor.';

        if(!error){
            setConfigRef([cotizacionRef.current,vendorRef.current,vendorFilterRef.current,columnaCodigoRef.current,columnaCostoRef.current,columnaTituloRef.current,isFinalRef.current,withTituloRef.current,ivaRef.current,ivaIncludedRef.current,modifyRef.current,modifyAffectRef.current,profitRef.current] as {name:string,value:string}[])
            setConfig({...config,...refConfig.current});
        } else alert(error);

    }

    const fileChangeHandler = (event:ChangeEvent<HTMLInputElement>)=>{
        const files = (event as ChangeEvent<HTMLInputElement>).target.files;
        if (files){
            setDisabled();
            (refSelectSheet.current as HTMLSelectElement).value = 'none';
            refConfig.current.xlsxItems = [];
            xlsxWorker.current.postMessage({task:'read',attach:(files as FileList)[0]});
        }
    }

    useEffect(()=>{
        initializateWorker();
    })

    useEffect(()=>{
        const {main,secondary} = products;
        (accountType == ACCOUNT_TYPE.main && main.length && secondary.length)||(accountType == ACCOUNT_TYPE.secondary && secondary.length)?setEnabled():setDisabled();            
    },[products])



    return (
        <>
        <InformationPanel products={products}/>

        <article className="box formBox">
            <h3>Configuracion</h3>

            <label>archivo</label>
            <input onChange={fileChangeHandler} ref={refInputFile} type="file" name="file"/>
            
            <Proveedores vendors={vendors} vendorRef={vendorRef} vendorFilterRef={vendorFilterRef} xlsxWorkBook={xlsxWorkBook} setConfigRef={setConfigRef} refConfig={refConfig}/>

            <Cotizaciones cotizacionRef={cotizacionRef}/>

            <Hojas xlsxWorkBook={xlsxWorkBook} setDisabled={setDisabled} xlsxWorker={xlsxWorker} refConfig={refConfig} refSelectSheet={refSelectSheet}/>

            <Columnas columnaCodigoRef={columnaCodigoRef} columnaCostoRef={columnaCostoRef} columnaTituloRef={columnaTituloRef} isFinalRef={isFinalRef} withTituloRef={withTituloRef}/>

            <label>iva</label>
            <div>
                <input ref={ivaRef} name="iva" type="number" min={0} />
                <select ref={ivaIncludedRef} name="ivaIncluido">
                    <option value="0">no incluido</option>
                    <option value="1">incluido</option>
                </select>
            </div>

            <label>modificacion</label>
            <div>
                <input ref={modifyRef} name="modificacion" type="number"/>
                <select ref={modifyAffectRef} name="modificacionAfecta" >
                    <option value="1">afecta</option>
                    <option value="0">no afecta</option>
                </select>
            </div>

            <label>rentabilidad</label>
            <input ref={profitRef} type="number" name="rentabilidad"/>

            <div>
                <button ref={refAceptButton} onClick={confirmHandler}>aceptar</button>
            </div>
        </article>
        </>
    )
}

export {ConfigPanel};