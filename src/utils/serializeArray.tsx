
const serializeArray = (arrayToSerialize:any[],index:string)=>{
    const serialized = arrayToSerialize.reduce((acc,current)=>{
      acc[current[index]]=current;
      return(acc)
    },{} as Record<string,any>)
    return serialized;
  }

  export {serializeArray};