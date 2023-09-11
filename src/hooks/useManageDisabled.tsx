import { useRef } from "react";
const useManageDisabled = ()=>{
    const refInputFile = useRef<HTMLInputElement>(null);
    const refSelectSheet = useRef<HTMLSelectElement>(null);
    const refAceptButton = useRef<HTMLButtonElement>(null);

    const setEnabled = ()=>{
        (refInputFile.current as HTMLInputElement).disabled = false;
        (refSelectSheet.current as HTMLSelectElement).disabled = false;
        (refAceptButton.current as HTMLButtonElement).disabled = false;
    }

    const setDisabled = ()=>{
        (refInputFile.current as HTMLInputElement).disabled = true;
        (refSelectSheet.current as HTMLSelectElement).disabled = true;
        (refAceptButton.current as HTMLButtonElement).disabled = true;
    }

    return {refInputFile,refSelectSheet,refAceptButton,setEnabled,setDisabled};
}

export {useManageDisabled};