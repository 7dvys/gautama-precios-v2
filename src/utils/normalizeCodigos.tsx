// import { Product } from "@/types/contabilium"
// import { getProducts, getToken, storeToken, updateProducts } from "@/services/contabilium"

// const normalizarandler = ()=>{
//     const client_id = localStorage.getItem('cbUser')??'';
//     const client_secret = localStorage.getItem('cbPass')??'';
//     getToken({client_id,client_secret}).then((token)=>{
//         getProducts(token.access_token).then((products)=>{
//             if(products){
//                 const withoutDesc = products.filter(product=>{
//                     const {Codigo,Descripcion} = product;
//                     if(!Descripcion || !Descripcion.length || Descripcion!=Codigo || Descripcion.trim() != Codigo.trim())
//                     return true
//                 })

//                 console.log(withoutDesc)

//                 // withoutDesc.forEach((product,index)=>{
//                 //     // if(!product.Descripcion.length)
//                 //     // console.log(product)
//                 //     const {Id,Codigo,Descripcion} = product;
//                 //     const newProduct:Product = {...product,
//                 //         Tipo:"P",
//                 //         Estado:"A",
//                 //         Descripcion:Codigo.trim()
//                 //     }
                    
//                 //     const endpoint ="https://rest.contabilium.com/api/conceptos/?id="+Id
//                 //     const fetchConfig = {
//                 //         method:'PUT',
//                 //         headers:{
//                 //             'Content-Type':'application/json',
//                 //             'Authorization':'Bearer '+token.access_token,
//                 //         },
//                 //         body:JSON.stringify(newProduct)
//                 //     }
                    
                    
             
//                 // })
//                 console.log('todos enviados');
//             }
            
//         })
//     })
// }

// export {normalizarandler}