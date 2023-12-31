
importScripts('https://unpkg.com/xlsx/dist/xlsx.full.min.js');
importScripts('https://unpkg.com/string-similarity/umd/string-similarity.min.js');

// La biblioteca xlsx se ha cargado completamente//


const compareTitles = ({stringA,stringB})=>{
    stringA = stringA?stringA.toString():''
    const similaryRate =  stringSimilarity.compareTwoStrings(stringA,stringB);
    const [rateWords,rateNumbers,rateNumbersAndWords] = [/[^stringA-zA-Z]/g,/[^0-9]/g,/[^a-zA-Z0-9]/g].map((regex)=>{
        const [xlsxTitleTokenized,titleTokenized] = [stringA,stringB].map(title=>title.split(/[\s\-Xx]+/).map(word=>(word.replace(regex, ''))));
        const rate = xlsxTitleTokenized.reduce((acc,word)=>{
            if(titleTokenized.includes(word) && word !== '') acc++;
            return acc;
        },0)/xlsxTitleTokenized.length;

        return rate;
    })

    const rate = rateNumbers*0.25+rateWords*0.15+rateNumbersAndWords*0.3+similaryRate*0.3
    return {rate};
}


onmessage = (event)=>{
    const {task,attach} = event.data;
    const read = ()=>{
        attach.arrayBuffer().then(data=>{
            const xlsxWorkBook = self.XLSX.read(data);
            self.postMessage({task:task,attach:xlsxWorkBook})   
        }
    )}

    const sheetToJson = ()=>{
        const xlsxWorkBookSheet = attach; 
        const sheetToJson=self.XLSX.utils.sheet_to_json(xlsxWorkBookSheet,{header:1,defval:'_null'})
        self.postMessage({task,attach:sheetToJson});
    }

    const discoverProducts = ()=>{
        const {xlsxItems,products} = attach;
        
        console.log(compareTitles({stringA:'hola como estas',stringB:'hola'}))
        console.log(compareTitles({stringA:'hola',stringB:'hola como estas'}))

        self.postMessage({task,attach:{}});

    }


    if(task == 'read')
    read();

    if(task == 'sheetToJson')
    sheetToJson()

    if(task == 'discoverProducts')
    discoverProducts()
}

