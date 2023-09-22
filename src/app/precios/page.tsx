import { Metadata } from "next";
import { Precios } from "@/components/Precios"

export const metadata: Metadata = {
    title: 'Precios',
}

const PreciosPage:React.FC = ()=>{
    return (<Precios/>)
}

export default PreciosPage