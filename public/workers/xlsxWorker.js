importScripts('https://unpkg.com/xlsx/dist/xlsx.full.min.js');
// La biblioteca xlsx se ha cargado completamente

  

onmessage = (event)=>{
    const {task,attach} = event.data;

    if(task == 'read')
    attach.arrayBuffer().then(
    data=>{
        const xlsxWorkBook = self.XLSX.read(data);
        self.postMessage({task:task,attach:xlsxWorkBook})   
        }
    )

    if(task == 'sheetToJson'){
        const xlsxWorkBookSheet = attach; 
        const sheetToJson=self.XLSX.utils.sheet_to_json(xlsxWorkBookSheet,{header:1,defval:'_null'})
        self.postMessage({task,attach:sheetToJson});
    }
}

