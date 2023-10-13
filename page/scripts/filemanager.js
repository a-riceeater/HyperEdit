async function openFolder() {
    const dirname = (await ipcRenderer.invoke("openFolder"))[0];
    console.log("%c[Filehandler]", "color: purple", "Opening folder " + dirname);
    const files = fs.readdirSync(dirname);

    document.querySelector(".nof-op").innerHTML = "";

    const fnameElm = document.createElement("div");
    fnameElm.innerHTML = dirname.replace(/^.*[\\\/]/, '');
    document.querySelector(".nof-op").appendChild(fnameElm);
    
    for (let i = 0; i < files.length; i++) {
        const file = path.join(dirname, files[i]);

        if (fs.lstatSync(file).isDirectory()) {
            console.log("%c[Files]", "color: blue", "Importing directory " + files[i])
            if (files[i] == ".git") { console.log("%c[Files]", "color: yellow", ".git directory detected, ignoring"); continue }

            const folderElm = document.createElement("div");
            folderElm.innerHTML = files[i];
            folderElm.setAttribute("data-path", file);

            document.querySelector(".nof-op").appendChild(folderElm);

            recursiveFolder(file, 10)

        } else {
            console.log("%c[Files]", "color: blue", "Importing " + files[i] + "...");

            const fileElm = document.createElement("div");
            fileElm.innerHTML = files[i];
            fileElm.setAttribute("data-path", file);

            document.querySelector(".nof-op").appendChild(fileElm);
        }
    }
}
ipcRenderer.on("openFolder", openFolder);

function recursiveFolder(dirname, indent) {
    console.log(dirname)
    const files = fs.readdirSync(dirname);
    
    for (let i = 0; i < files.length; i++) {
        const file = path.join(dirname, files[i]);
        
        if (fs.lstatSync(file).isDirectory()) {
            const folderElm = document.createElement("div");
            folderElm.innerHTML = file.replace(/^.*[\\\/]/, '');
            folderElm.setAttribute("data-path", file);
            folderElm.style.marginLeft = indent + "px";
            document.querySelector(".nof-op").appendChild(folderElm);
            recursiveFolder(file, indent + 10);
        } else {
            const fileElm = document.createElement("div");
            fileElm.innerHTML = file.replace(/^.*[\\\/]/, '');
            fileElm.setAttribute("data-path", file);
            fileElm.style.marginLeft = indent + "px";
            document.querySelector(".nof-op").appendChild(fileElm);
        }
    }
}

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