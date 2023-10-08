const fs = require("fs");
const { ipcRenderer } = require("electron");

async function openFolder() {
    const files = await ipcRenderer.invoke("openFolder");
    console.dir(files);
}

openFolder();