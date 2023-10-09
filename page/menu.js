if (process.platform == 'darwin') {
    document.querySelector(".topbar-btns").style.display = "none"
    document.querySelector(".topbar > .dft-logo").style.right = "10px"
} else {
    document.querySelector(".topbar > .dft-logo").style.left = "5px"
    document.querySelector(".topbar-btns").style.display = "block"
} 