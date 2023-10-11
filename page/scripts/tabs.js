var currentTab = "tab-welcome";
const editorEle = document.querySelector(".editor");

document.querySelectorAll(".tabbar > .tab-btn > span").forEach(el => {
    el.addEventListener("click", (e) => {
        if (currentTab == "tab-" + e.target.parentNode.getAttribute("id")) {
            editorEle.innerHTML = `
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                <img src="./logo.png" height="200px" width="200px" style="margin-bottom: 0">
                <p style="margin-top: -20px; font-family: 'Lato', sans-serif; color: lightgray; user-select: none; cursor: default;">Open a file to begin</p>
            </div>
            `
        }

        e.target.parentNode.remove();
    })
})

class Tab {
    constructor(file) {
        const fdata = fs.readFileSync(file, "utf8");
        let lines = fdata.split("\n").length;
        let linedata = "";

        for (let i = 0; i < lines; i++) {
            linedata += `${i + 1}<br>`
        }

        document.querySelectorAll(".tab-btn.selected").forEach(e => e.classList.remove("selected"));

        const tbe = document.createElement("div");
        tbe.innerHTML = `<span>${file.replace(/^.*[\\\/]/, '')}</span>`
        tbe.classList.add("tab-btn");
        tbe.classList.add("selected");
        tbe.id = `tab-${file}`

        tbe.childNodes.forEach(el => {
            if (el.nodeName != "SPAN") return
            el.addEventListener("click", () => {
                if (currentTab == "tab-" + file) {
                    editorEle.innerHTML = `
                    <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
                        <img src="./logo.png" height="200px" width="200px" style="margin-bottom: 0">
                        <p style="margin-top: -20px; font-family: 'Lato', sans-serif; color: lightgray; user-select: none; cursor: default;">Open a file to begin</p>
                    </div>
                    `
                }
    
                tbe.remove();
            })
        })

        document.querySelector(".tabbar").appendChild(tbe);

        document.querySelector(".editor").innerHTML = `
        <div id="lineNumbers" onscroll="return false">
            ${linedata}
        </div>
        <pre>
            <div id="highlight">${hljs.highlight(fdata, { language: /(?:\.([^.]+))?$/.exec(file)[1] }).value}</div>
        </pre>
        <textarea id="codeInput" spellcheck="false" autofocus="true" autocomplete="off">${fdata}</textarea>
        `

        currentTab = "tab-" + file;

        setTimeout(() => {
            document.querySelector("#lineNumbers").addEventListener("scroll", (e) => {
                document.querySelector("#codeInput").scrollTop = e.target.scrollTop;
                document.querySelector("#highlight").scrollTop = e.target.scrollTop;
            });

            document.querySelector("#codeInput").addEventListener("scroll", (e) => {
                document.querySelector("#lineNumbers").scrollTop = e.target.scrollTop;
                document.querySelector("#highlight").scrollTop = e.target.scrollTop;
                document.querySelector("#highlight").scrollLeft = e.target.scrollLeft;
            });

            document.querySelector("#codeInput").addEventListener("keydown", (e) => {
                setTimeout(() => {
                    document.querySelector("#highlight").innerHTML = hljs.highlight(e.target.value, { language: /(?:\.([^.]+))?$/.exec(file)[1] }).value
                    document.querySelector("#lineNumbers").scrollTop = e.target.scrollTop;
                    document.querySelector("#highlight").scrollTop = e.target.scrollTop;
                    document.querySelector("#highlight").scrollLeft = e.target.scrollLeft;
                })
            })
        })
    }
}