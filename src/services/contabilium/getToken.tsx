const getToken = async({cbUser,cbPass}:{cbUser:string,cbPass:string})=>{
    const location = 'https://rest.contabilium.com/token';

    const body = new URLSearchParams();
    body.append('grant_type', 'client_credentials');
    body.append('client_id', cbUser);
    body.append('client_secret', cbPass);
    
    const config = {
        method:'POST',
        headers:{
            'Content-Type':'application/x-www-form-urlencoded',
        },
        cache:'no-store',
        body:body
    }

    const response = await fetch(location,config as ResponseInit);

    if(response.ok)
    return await response.json()
    else {
        response.text().then(error=>{console.log(error)})
        return false;
    };
}

export {getToken};