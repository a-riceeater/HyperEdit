async function openFolder() {
    const dirname = (await ipcRenderer.invoke("openFolder"))[0];
    console.log("%c[Filehandler]", "color: purple", "Opening folder " + dirname);
    document.querySelector(".nof-op").innerHTML = "";
    await loadFolderContents(document.querySelector(".nof-op"), dirname, 0);
}

ipcRenderer.on("openFolder", openFolder);

async function loadFolderContents(parentElm, dirname, indent) {
    const files = await fs.promises.readdir(dirname);

    for (let i = 0; i < files.length; i++) {
        const file = path.join(dirname, files[i]);
        const stats = await fs.promises.lstat(file);

        if (stats.isDirectory()) {
            if (files[i] === ".git") {
                console.log("%c[Files]", "color: yellow", ".git directory detected, ignoring");
                continue;
            }

            const folderElm = document.createElement("div");
            folderElm.innerHTML = files[i];
            folderElm.setAttribute("data-path", file);
            folderElm.classList.add("folder");
            folderElm.style.marginLeft = indent + "px";

            parentElm.appendChild(folderElm);

            folderElm.addEventListener("click", async (e) => {
                if (e.target.getAttribute("data-path") != folderElm.getAttribute("data-path")) return
                // note that if the folder parent is clicked (not the files inside) it will hide the folder
                if (!folderElm.hasLoaded) {
                    await loadFolderContents(folderElm, file, indent + 10);
                    folderElm.hasLoaded = true;
                }
                folderElm.classList.toggle("expanded");

                // Toggle the display style for child elements
                const childElements = folderElm.querySelectorAll('.folder, div[data-path]');
                for (const child of childElements) {
                    child.style.display = folderElm.classList.contains("expanded") ? "block" : "none";
                }
            });
        } else {
            const fileElm = document.createElement("div");
            fileElm.innerHTML = files[i];
            fileElm.setAttribute("data-path", file);
            fileElm.style.marginLeft = indent + "px";

            parentElm.appendChild(fileElm);
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