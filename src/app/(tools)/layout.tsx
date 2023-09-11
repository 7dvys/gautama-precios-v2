'use client'
import { useEffect,useState } from "react";
import { storeToken,getVendors } from "@/utils/contabilium"
import { toolsContext } from "@/context";
import { Vendor } from "@/types/contabilium";

const ToolsLayout = ({children}:{children:React.ReactElement})=>{

    const [token,setToken] = useState<string>('')
    const [vendors,setVendors] = useState<Vendor[]>([]);

    useEffect(()=>{
        const initializeToken = async()=>{
            const client_id = localStorage.getItem('cbUser')??'';
            const client_secret = localStorage.getItem('cbPass')??'';

            if(client_id && client_secret){

                const storeTokenResponse = await storeToken({client_id,client_secret});
                if(storeTokenResponse){
                    const token = storeTokenResponse;
                    const vendorsResponse = await getVendors(token);
                    if(vendorsResponse){
                        const vendors = vendorsResponse;
                        setVendors(vendors);
                    }
                    setToken(token);
                }
            }                             
        }

        initializeToken();
    },[])
    
    return (
        
    <article className="tool">
        <toolsContext.Provider value={{token,vendors}}>
            {children}
        </toolsContext.Provider>
    </article>
    )
}
export default ToolsLayout