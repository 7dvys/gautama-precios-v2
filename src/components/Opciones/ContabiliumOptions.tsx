'use client'

import { ACCOUNT_TYPE, LOCALSTORAGE_KEYS } from "@/constants";
import { useRef,ChangeEvent,useContext } from "react";
import { rootContext } from "@/context";
import { LoginProps } from "@/types/contabilium";


const ContabiliumOptions:React.FC = ()=>{
    const {login} = useContext(rootContext);

    const isClient = typeof window !== 'undefined';

    const opcionesMain:Record<string,string> = {}
    opcionesMain[LOCALSTORAGE_KEYS.cbUserMain] = isClient?localStorage.getItem(LOCALSTORAGE_KEYS.cbUserMain)??'':''
    opcionesMain[LOCALSTORAGE_KEYS.cbPassMain] = isClient?localStorage.getItem(LOCALSTORAGE_KEYS.cbPassMain)??'':''
    
    const opciones764 = useRef<Record<string,string>>(opcionesMain)

    const changeHandler764 = (event:ChangeEvent<HTMLInputElement>)=>{
        opciones764.current[event.target.name] = event.target.value ??"";
    }

    const updateOpciones764 = ()=>{
        if (isClient){
            localStorage.removeItem(LOCALSTORAGE_KEYS.cbApiTokenMain);
            const cbUser = opciones764.current[LOCALSTORAGE_KEYS.cbUserMain];
            const cbPass = opciones764.current[LOCALSTORAGE_KEYS.cbPassMain];
            const accountType = ACCOUNT_TYPE.main;
            login({cbUser,cbPass,accountType} as LoginProps).then(loginStatus=>{
                if(loginStatus){
                    localStorage.setItem(LOCALSTORAGE_KEYS.cbUserMain,cbUser);
                    localStorage.setItem(LOCALSTORAGE_KEYS.cbPassMain,cbPass);
                    alert('logueado!')
                }else{
                    alert('error al loguear')
                }
            })
        }
    }

    const opcionesSecondary:Record<string,string> = {};
    opcionesSecondary[LOCALSTORAGE_KEYS.cbUserSecondary] = isClient?localStorage.getItem(LOCALSTORAGE_KEYS.cbUserSecondary)??'':''
    opcionesSecondary[LOCALSTORAGE_KEYS.cbPassSecondary] = isClient?localStorage.getItem(LOCALSTORAGE_KEYS.cbPassSecondary)??'':''

    const opciones925 = useRef<Record<string,string>>(opcionesSecondary)

    const changeHandler925 = (event:ChangeEvent<HTMLInputElement>)=>{
        opciones925.current[event.target.name] = event.target.value ??"";
    }

    const updateOpciones925 = ()=>{
        if (isClient){
            localStorage.removeItem(LOCALSTORAGE_KEYS.cbApiTokenSecondary);
            const cbUser = opciones925.current[LOCALSTORAGE_KEYS.cbUserSecondary];
            const cbPass = opciones925.current[LOCALSTORAGE_KEYS.cbPassSecondary];
            const accountType = ACCOUNT_TYPE.secondary;
            login({cbUser,cbPass,accountType} as LoginProps).then(loginStatus=>{
                if(loginStatus){
                    localStorage.setItem(LOCALSTORAGE_KEYS.cbUserSecondary,cbUser);
                    localStorage.setItem(LOCALSTORAGE_KEYS.cbPassSecondary,cbPass);
                    alert('logueado!')
                }else{
                    alert('error al loguear')
                }
            })
        }
    }

    const accountTypeRef = useRef<HTMLSelectElement>(null)

    const updateTypeAccount = ()=>{
        localStorage.setItem(LOCALSTORAGE_KEYS.accountType,(accountTypeRef.current as HTMLSelectElement).value)
        location.reload();
    }

   

    return (
        <>
        <section className="flex flex-column flex-gap">
            <div onChange={changeHandler764} className="formBox box">
                <h3>Contabilium 764</h3>    
                <input name={LOCALSTORAGE_KEYS.cbUserMain} type="text" placeholder="usuario" defaultValue={opciones764.current[LOCALSTORAGE_KEYS.cbUserMain]}/>
                <input name={LOCALSTORAGE_KEYS.cbPassMain} type="password" placeholder="password"/>
                <div>
                    <button onClick={updateOpciones764}>aceptar</button>
                </div>
            </div>
            <div onChange={changeHandler925} className="formBox box">
                <h3>Contabilium 925</h3>    
                <input name={LOCALSTORAGE_KEYS.cbUserSecondary} type="text" placeholder="usuario" defaultValue={opciones925.current[LOCALSTORAGE_KEYS.cbUserSecondary]}/>
                <input name={LOCALSTORAGE_KEYS.cbPassSecondary} type="password" placeholder="password"/>
                <div>
                    <button onClick={updateOpciones925}>aceptar</button>
                </div>
            </div>
            <div className="formBox box">
                <h3>Tipo de cuenta</h3>
                <select name="accountType" ref={accountTypeRef} defaultValue={localStorage.getItem(LOCALSTORAGE_KEYS.accountType)??ACCOUNT_TYPE.secondary}>
                    <option value={ACCOUNT_TYPE.main}>primaria</option>
                    <option value={ACCOUNT_TYPE.secondary}>secundaria</option>
                </select>
                <div>
                    <button onClick={updateTypeAccount}>aceptar</button>
                </div>
            </div>
        </section>
        
        </>
    )
}

export {ContabiliumOptions};