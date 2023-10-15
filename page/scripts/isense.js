/**
 * @name InteliSense
 * @author Elijah a-riceeater
 */

function initIsense() {
    getCaretPixelPosition();
}

function getCaretPixelPosition() {
    const codeInput = document.getElementById('codeInput');
    const caretPosition = getCaretPosition(codeInput);

    // Get the position of the codeInput element
    const rect = codeInput.getBoundingClientRect();

    // Calculate the pixel position of the caret
    const caretX = rect.left + caretPosition.left + window.scrollX;
    const caretY = rect.top + caretPosition.top + window.scrollY;

    // Display the caret position (you can modify this based on your needs)
    document.getElementById('caretElement').innerText = `Caret position: X=${caretX}, Y=${caretY}`;

    // Show the caretElement
    document.getElementById('caretElement').style.display = 'block';
}

function getCaretPosition(element) {
    // Get the caret position within the element
    const selection = window.getSelection();

    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rects = range.getClientRects();

        if (rects.length > 0) {
            // Use the first rectangle (caret position)
            const rect = rects[0];
            return {
                top: rect.top,
                left: rect.left,
            };
        }
    }

    return { top: 0, left: 0 };
}
