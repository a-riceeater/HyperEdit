async function openFolder() {
    const files = await ipcRenderer.invoke("openFolder");
    console.dir(files);
}
ipcRenderer.on("openFolder", openFolder);

async function openFile() {
    const file = (await ipcRenderer.invoke("openFile"))[0];
    const tab = new Tab(file);
}
ipcRenderer.on("openFile", openFile);

async function saveFile() {
    
}
ipcRenderer.on("saveFile", saveFile);