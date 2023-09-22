import { Vendor } from "@/types/contabilium";

const getVendors = async (token:string)=>{
    const location = 'https://rest.contabilium.com/api/proveedores/search?pageSize=50&page=';

    const config = {
        method:'GET',
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer '+token,
        },
        cache:'no-store',
    }

    let page = 0;
    const response = await fetch(location+`${++page}`,config as ResponseInit);

    if(!response.ok)
    return false;
    
    const {Items,TotalItems} = await response.json();

    let remainingPages = Math.trunc((TotalItems-50)/50)
    
    if((TotalItems-50)%50) 
    remainingPages++;

    
    const promises = [];
    for(let times=0;times<remainingPages;times++){
    const promise = fetch(location+`${++page}`,config as ResponseInit);
        promises.push(promise)
    }

    const jsonPromises:Promise<{Items:Vendor[]}>[] = [];
    await Promise.all(promises).then((vendorResponses)=>{
        vendorResponses.forEach((response)=>{
            if(response.ok) jsonPromises.push(response.json())
            else return false;
        })
    })

    const allVendors:Vendor[] = [];
    await Promise.all(jsonPromises).then((vendors)=>{
        vendors.forEach(({Items})=>{
            allVendors.push(...Items);
        })
    })
    
    allVendors.push(...Items);
    return allVendors;
}

export {getVendors};