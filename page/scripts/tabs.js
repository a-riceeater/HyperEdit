var currentTab = "tab-welcome";
const editorEle = document.querySelector(".editor");

document.querySelectorAll(".tabbar > .tab-btn > span").forEach(el => {
    el.addEventListener("click", (e) => {
        if (currentTab == e.target.parentNode.getAttribute("id")) {
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
    constructor (file) {
        const fdata = fs.readFileSync(file, "utf8");
        let lines = fdata.split("\n").length;
        let linedata = "";

        for (let i = 0; i < lines; i++) {
            linedata += `${i + 1}<br>`
        }
        
        document.querySelector(".editor").innerHTML = `
        <div id="lineNumbers">
            ${linedata}
        </div>
        <pre>
            <div id="highlight"></div>
        </pre>
        <textarea id="codeInput" spellcheck="false" autofocus="true" autocomplete="off">${fdata}</textarea>
        `
    }
}