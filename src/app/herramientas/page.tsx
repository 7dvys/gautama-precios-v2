import { Herramientas } from "@/components/Herramientas";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Herramientas',
}

const HerramientasPage:React.FC = ()=>{
    return (<><Herramientas/></>)
}

export default HerramientasPage