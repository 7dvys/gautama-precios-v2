const getToken = async({client_id,client_secret}:{client_id:string,client_secret:string})=>{
    const location = 'https://rest.contabilium.com/token';

    const body = new URLSearchParams();
    body.append('grant_type', 'client_credentials');
    body.append('client_id', client_id);
    body.append('client_secret', client_secret);
    
    const config = {
        method:'POST',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded',
        },
        cache:'no-store',
        body:body
    }

    const response = await fetch(location,config as ResponseInit);

    if(response.ok !== false)
    return await response.json()
    else return false;
}

export {getToken};