
//Map a name to an valid azure blob folder
export const azureBlobFolderNameTransform =(name: string)=>{
    return name.replace(' ','')
}