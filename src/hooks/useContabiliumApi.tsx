import { useEffect, useState } from "react"
import { LOCALSTORAGE_KEYS, ACCOUNT_TYPE } from "@/constants";
import { LoginProps, UpdateProducts, Vendor } from "@/types/contabilium";
import { getProducts,getToken, getVendors, initializeUpdateProducts } from "@/services/contabilium";
import { Products } from "@/types/Precios";



const useContabiliumApi = ()=>{
    const [tokenMain,setTokenMain] = useState<string>('');
    const [tokenSecondary,setTokenSecondary] = useState<string>('');
    const accountType = typeof window != 'undefined'?localStorage.getItem(LOCALSTORAGE_KEYS.accountType)??ACCOUNT_TYPE.main:'';

    const [products,setProducts] = useState<Products>({main:[],secondary:[]});
    const [vendors,setVendors] = useState<Vendor[]>([]);
    const [updateProducts,setUpdateProducts] = useState<UpdateProducts|null>(null)

    
    const login = async({cbUser,cbPass,accountType}:LoginProps)=>{
        const {localStorageKey,setTokenState} = accountType == ACCOUNT_TYPE.main
        
        ?{
            localStorageKey:LOCALSTORAGE_KEYS.cbApiTokenMain,
            setTokenState:setTokenMain
        }:{
            localStorageKey:LOCALSTORAGE_KEYS.cbApiTokenSecondary,
            setTokenState:setTokenSecondary
        }

        localStorage.setItem(localStorageKey,'');

        const response = await getToken({cbUser,cbPass})
        if(response){
            const cbApiToken = response;
            cbApiToken.expire_time_inSeconds = new Date().getTime()/1000+cbApiToken.expires_in;
            localStorage.setItem(localStorageKey,JSON.stringify(cbApiToken))
            setTokenState(cbApiToken.access_token)
            return true;
        }else return false;
    }

    const initializeProducts = ({token,productKey}:{token:string,productKey:'main'|'secondary'})=>{
        getProducts(token).then(productsResponse=>{
            if(productsResponse){
                setProducts(prevProducts => {
                    return {
                      ...prevProducts,
                      [productKey]: productsResponse,
                    };
                });
            } 
        })
    }

    const initializeVendors = ({token}:{token:string})=>{
        getVendors(token).then(vendorsResponse=>{
            if(vendorsResponse) setVendors(vendorsResponse);
        })
    }

    
    useEffect(()=>{
        const [cbUserMain,cbUserSecondary,cbPassMain,cbPassSecondary] = [LOCALSTORAGE_KEYS.cbUserMain,LOCALSTORAGE_KEYS.cbUserSecondary,LOCALSTORAGE_KEYS.cbPassMain,LOCALSTORAGE_KEYS.cbPassSecondary].map((localStorageKey)=>(localStorage.getItem(localStorageKey)??''));
        const initializeToken = async ({cbUser,cbPass,accountType}:LoginProps)=>{
            if(!cbUser || !cbPass){
                alert(`[!] Por favor loguee en la cuenta ${accountType==ACCOUNT_TYPE.main?'principal':'secundaria'}.`)
                return false;
            }
            
            const localStorageKey = accountType == ACCOUNT_TYPE.main?LOCALSTORAGE_KEYS.cbApiTokenMain:LOCALSTORAGE_KEYS.cbApiTokenSecondary;

            const tokenExist = localStorage.getItem(localStorageKey)
            const isTokenExpired = parseInt(JSON.parse(localStorage.getItem(localStorageKey) as string).expire_time_inSeconds) <= new Date().getTime()/1000
            
            if(!tokenExist || isTokenExpired){
                return await login({cbUser,cbPass,accountType})
            }
            
            const cbApiTokenOnStorage = localStorage.getItem(localStorageKey)??'{}';
            const cbApiToken =JSON.parse(cbApiTokenOnStorage).access_token;
            if(cbApiTokenOnStorage) accountType == ACCOUNT_TYPE.main?setTokenMain(cbApiToken):setTokenSecondary(cbApiToken);
            else return false;
        }

        [[cbUserMain,cbPassMain,ACCOUNT_TYPE.main],[cbUserSecondary,cbPassSecondary,ACCOUNT_TYPE.secondary]].forEach(([cbUser,cbPass,accountType])=>{initializeToken({cbUser,cbPass,accountType} as LoginProps)});
    },[])

    useEffect(()=>{
        if(tokenMain){
            if(accountType != ACCOUNT_TYPE.secondary)
            initializeProducts({token:tokenMain,productKey:ACCOUNT_TYPE.main});
            initializeVendors({token:tokenMain});
        }
    },[tokenMain])

    useEffect(()=>{
        if(tokenSecondary){
            initializeProducts({token:tokenSecondary,productKey:ACCOUNT_TYPE.secondary});
        }
    },[tokenSecondary])

    useEffect(() => {
        if (tokenMain && tokenSecondary) {
          const {updateProducts} = initializeUpdateProducts({ token: { main: tokenMain, secondary: tokenSecondary } });
          setUpdateProducts(()=>updateProducts); // Aquí estás configurando updateProductsFunc correctamente como la función devuelta por initializeUpdateProducts
        }
      }, [tokenMain, tokenSecondary]);
      

    return {login,vendors,products,tokenMain,updateProducts};

}

export {useContabiliumApi};