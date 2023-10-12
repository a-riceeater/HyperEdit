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
    if (currentTab == "tab-welcome") return
    console.log("%c[Writer]", "color: green", "Attempting to save file...")

    const file = currentTab.replace("tab-", "");
    const fdata = document.querySelector("#codeInput").value;
    
    fs.writeFile(file, fdata, (err) => {
        if (err) {
            console.log("%cWriter", "color: red", "Failed to write file!")
            console.error(err);

            const em = document.createElement("div");
            em.classList.add("err-modal");
            em.innerHTML = `
            <h1 class="title">Failed to write/save file</h1>
            <p class="desc">${err}</p>
            <button>OK</button>
            `

            em.childNodes.forEach(el => {
                if (el.nodeName != "BUTTON") return
            })

            document.body.appendChild(em);
            return
        }

        console.log("%c[Writer]", "color: green", "Sucessfully wrote file")
    })
}
ipcRenderer.on("saveFile", saveFile);