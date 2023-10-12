async function openFolder() {
    const dirname = (await ipcRenderer.invoke("openFolder"))[0];
    console.log("%c[Filehandler]", "color: purple", "Opening folder " + dirname);
    const files = fs.readdirSync(dirname);
    
    for (let i = 0; i < files.length; i++) {
        const file = path.join(dirname, files[i]);

        if (fs.lstatSync(file).isDirectory()) {
            console.log("%c[Files]", "color: blue", "Importing directory " + files[i])
        } else {
            console.log("%c[Files]", "color: blue", "Importing " + files[i] + "...");
        }
    }
}
ipcRenderer.on("openFolder", openFolder);

async function openFile() {
    const file = (await ipcRenderer.invoke("openFile"))[0];
    if (!file) return
    
    console.log("%c[Filehandler]", "color: purple", "Opening file " + file);
    new Tab(file);
}
ipcRenderer.on("openFile", openFile);

async function saveFile() {
    if (currentTab == "tab-welcome") return
    console.log("%c[Writer]", "color: green", "Attempting to save file...")

    const file = document.querySelector(".tab-btn.selected").getAttribute("data-path");
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

        console.log("%c[Writer]", "color: green", "Sucessfully saved file")
        document.querySelector(`#${currentTab} > span`).style.fontStyle = "normal"
    })
}
ipcRenderer.on("saveFile", saveFile);