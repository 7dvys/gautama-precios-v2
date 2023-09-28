// import { getToken } from ".";
// import { LOCALSTORAGE_KEYS } from "@/constants";

// const storeToken = async({client_id,client_secret}:{client_id:string,client_secret:string}):Promise<string|false>=>{

//     if((!localStorage.getItem(LOCALSTORAGE_KEYS.) || parseInt(JSON.parse(localStorage.getItem(LOCALSTORAGE_KEYS.cbApiToken) as string).expire_time_inSeconds) < new Date().getTime()/1000)){
//         const response = await getToken({client_id,client_secret})
//         if(response){
//             const apiToken = response;
//             apiToken.expire_time_inSeconds = new Date().getTime()/1000+apiToken.expires_in;
//             localStorage.setItem(LOCALSTORAGE_KEYS.cbApiToken,JSON.stringify(apiToken))
//             return apiToken.access_token;
//         }else return false;
//     }
    
//     const cbApiTokenOnStorage = localStorage.getItem(LOCALSTORAGE_KEYS.cbApiToken)
//     if(cbApiTokenOnStorage) return JSON.parse(cbApiTokenOnStorage).access_token;
//     else return false;
// }

// export {storeToken};