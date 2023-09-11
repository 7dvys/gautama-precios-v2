import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Precios',
}

const PreciosLayout = ({children}:{children:React.ReactNode})=>{
    return <>{children}</>
}

export default PreciosLayout