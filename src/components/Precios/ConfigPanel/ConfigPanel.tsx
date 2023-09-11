import { useRef,useEffect, useState, } from "react";
import { ConfigPanelProps,Config } from "@/types/Precios";
import { initializateXlsxWorker, setConfigChangeHandler, setConfirmHandler } from "@/utils/precios/configPanel";
import { Proveedores,Rentabilidad,Hojas, Columnas } from "@/components/Precios/ConfigPanel";
import * as XLSX from 'xlsx';
import { useManageDisabled } from "@/hooks/useManageDisabled";

const ConfigPanel:React.FC<ConfigPanelProps> = ({config,setConfig,vendors,products})=>{

    const [xlsxWorkBook,setXlsxWorkBook] = useState<XLSX.WorkBook>({SheetNames:[] as string[]} as XLSX.WorkBook);
    const refConfig = useRef<Config>(config);
    const {refAceptButton,refInputFile,refSelectSheet,setDisabled,setEnabled} = useManageDisabled()
    
    const xlsxWorker = useRef<Worker>({} as Worker);
    const {initializateWorker} = initializateXlsxWorker({setXlsxWorkBook,refConfig,setEnabled,xlsxWorker});

    const [proveedoresValues,setProveedoresValues] = useState({
        vendorValue:'none',
        discriminarValue:'none',
    });
    const [rentabilidadValues,setRentabilidadValues] = useState({isFinal:0});
    const [selectedSheet,setSelectedSheet] = useState('none');
    const [TituloValues,setTituloValues] = useState({tieneTitulo:1});

    
    const {configChangeHandler} = setConfigChangeHandler({refConfig,setDisabled,xlsxWorker,refSelectSheet})
    const {confirmHandler} = setConfirmHandler({refConfig,config,setConfig});


    useEffect(()=>{
        initializateWorker();
    },[])

    useEffect(()=>{
        products.length?setEnabled():setDisabled();            
    },[products])

    return (
        <article onChange={configChangeHandler} className="box formBox">
            <h3>Configuracion</h3>

            {/* <label>cotizacion</label>
            <select name="cotizacion">
                <option value="">cotizacion</option>
            </select> */}

            <Proveedores setProveedoresValues={setProveedoresValues} proveedoresValues={proveedoresValues} vendors={vendors}/>

            <label>archivo</label>
            <input ref={refInputFile} type="file" name="file"/>

            <Hojas xlsxWorkBook={xlsxWorkBook} setDisabled={setDisabled} xlsxWorker={xlsxWorker} refConfig={refConfig} refSelectSheet={refSelectSheet} setSelectedSheet={setSelectedSheet} selectedSheet={selectedSheet} />

            <Columnas setTituloValues={setTituloValues} tituloValues={TituloValues}/>

            <label>iva</label>
            <div>
                <input name="iva" type="number" min={0} />
                <select name="ivaIncluido" >
                    <option value="1">incluido</option>
                    <option value="0">no incluido</option>
                </select>
            </div>

            <label>modificacion</label>
            <div>
                <input name="modificacion" type="number" min={0} />
                <select name="modificacionAfecta" >
                    <option value="1">afecta</option>
                    <option value="0">no afecta</option>
                </select>
            </div>

            <Rentabilidad rentabilidadValues={rentabilidadValues} setRentabilidadValues={setRentabilidadValues}/>

            <div>
            {/* <button ref={refAceptButton} onClick={()=>{console.log(refConfig.current)}}>aceptar</button> */}
            <button ref={refAceptButton} onClick={confirmHandler}>aceptar</button>
            </div>
        </article>
    )
}

export {ConfigPanel};