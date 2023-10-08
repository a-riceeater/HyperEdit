const fs = require("fs");
const { ipcRenderer } = require("electron");

async function openFolder() {
    const files = await ipcRenderer.invoke("openFolder");
    console.dir(files);
}
ipcRenderer.on("openFolder", openFolder);

async function openFile() {
    const file = await ipcRenderer.invoke("openFile");
}
ipcRenderer.on("openFile", openFile);

async function saveFile() {

}
ipcRenderer.on("saveFile", saveFile);