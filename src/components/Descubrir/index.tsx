'use client'

import { useDiscoverProducts } from "@/hooks/useDiscoverProducts"
import { ConfigPanel } from "./ConfigPanel"
import { useEffect,useContext } from "react";
import { rootContext } from "@/context";


const Descubrir:React.FC = ()=>{
    const {products} = useContext(rootContext);
    const {potentialMatches,setPotentialMatches} = useDiscoverProducts();

    useEffect(()=>{
        // console.log(potentialMatches)
        console.log(products.main[0])
    },[potentialMatches,products])

    return (
        <div className="flex flex-column flex-gap">

            <ConfigPanel setPotentialMatches={setPotentialMatches} products={products}/>
            <main>

            </main>
        </div>
    )
}
export {Descubrir} 