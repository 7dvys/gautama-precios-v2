import { getToken } from ".";

const storeToken = async({client_id,client_secret}:{client_id:string,client_secret:string}):Promise<string|false>=>{

    if((!localStorage.getItem('cbApiToken') || parseInt(JSON.parse(localStorage.getItem('cbApiToken') as string).expire_time_inSeconds) < new Date().getTime()/1000)){
        const response = await getToken({client_id,client_secret})
        if(response){
            const apiToken = response;
            apiToken.expire_time_inSeconds = new Date().getTime()/1000+apiToken.expires_in;
            localStorage.setItem('cbApiToken',JSON.stringify(apiToken))
            return apiToken.access_token;
        }else return false;
    }
    
    const cbApiTokenOnStorage = localStorage.getItem('cbApiToken')
    if(cbApiTokenOnStorage) return JSON.parse(cbApiTokenOnStorage).access_token;
    else return false;
}

export {storeToken};