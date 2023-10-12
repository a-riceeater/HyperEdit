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
        const ext = /(?:\.([^.]+))?$/.exec(file)[1];

        for (let i = 0; i < lines; i++) {
            linedata += `${i + 1}<br>`
        }

        document.querySelectorAll(".tab-btn.selected").forEach(e => e.classList.remove("selected"));

        currentTab = `tab-${file.replace(/^.*[\\\/]/, '').replace(".", "")}-${Math.floor(Math.random() * 11)}`

        const tbe = document.createElement("div");
        tbe.innerHTML = `<span>${file.replace(/^.*[\\\/]/, '')}</span>`
        tbe.classList.add("tab-btn");
        tbe.classList.add("selected");
        tbe.id = `${currentTab}`

        tbe.childNodes.forEach(el => {
            if (el.nodeName != "SPAN") return
            el.addEventListener("click", () => {
                if (currentTab == "tab-" + file.replace(/^.*[\\\/]/, '')) {
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
            <div id="highlight">${ext ? hljs.highlight(fdata, { language: ext }).value : fdata}</div>
        </pre>
        <textarea id="codeInput" spellcheck="false" autofocus="true" autocomplete="off">${fdata}</textarea>
        `

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
                if (e.key == "Tab") e.preventDefault()

                setTimeout(() => {

                    switch (e.key) {
                        case "{":
                            insertAtCursor(document.getElementById("codeInput"), "}")
                            break
                        case "(":
                            insertAtCursor(document.getElementById("codeInput"), ")")
                            break
                        case "[":
                            insertAtCursor(document.getElementById("codeInput"), "]")
                            break
                        case "\"":
                            insertAtCursor(document.getElementById("codeInput"), "\"")
                            break
                        case "\'":
                            insertAtCursor(document.getElementById("codeInput"), "\'")
                            break
                        case "\`":
                            insertAtCursor(document.getElementById("codeInput"), "\`")
                            break
                        case "Tab":
                            insertAtCursor(document.getElementById("codeInput"), "\t")
                            insertAtCursor(document.getElementById("codeInput"), " ")
                            insertAtCursor(document.getElementById("codeInput"), " ")
                            insertAtCursor(document.getElementById("codeInput"), " ")
                            break
                    }

                    document.querySelector("#highlight").innerHTML = ext ? hljs.highlight(e.target.value, { language: ext }).value : e.target.value
                    document.querySelector("#lineNumbers").scrollTop = e.target.scrollTop;
                    document.querySelector("#highlight").scrollTop = e.target.scrollTop;
                    document.querySelector("#highlight").scrollLeft = e.target.scrollLeft;

                    let lined2 = "";
                    let line2 = e.target.value.split("\n").length

                    for (let i = 0; i < line2; i++) {
                        lined2 += `${i + 1}<br>`
                    }

                    document.getElementById("lineNumbers").innerHTML = lined2;
                    console.log(e.key, e.ctrlKey, e.metaKey, e.altKey, e.shiftKey)
                    if (e.key != "s" && !e.ctrlKey || e.key != "s" && !e.metaKey || !e.ctrlKey || !e.altKey || !e.shiftKey || !e.metaKey || e.key != "Meta") document.querySelector(`#${currentTab} > span`).style.fontStyle = "italic"
                })
            })
        })
    }
}

function insertAtCursor(myField, myValue) {
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
        sel.moveStart('character', -1); 
    } else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        
        myField.value = myField.value.substring(0, startPos)
            + myValue
            + myField.value.substring(endPos, myField.value.length);
        
        myField.focus();
        myField.selectionStart = startPos + myValue.length - 1; 
        myField.selectionEnd = startPos + myValue.length - 1;
    } else {
        myField.value += myValue;
    }
}