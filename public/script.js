const browserPrint = new BrowserPrint();
let selectedPrinter = null;

function findPrinter() {
    browserPrint.getDefaultDevice('printer', (device) => {
        if (device.name === 'Unknown Device') {
            console.error('No printer found');
        } else {
            console.log('Printer found:', device.name);
            selectedPrinter = device;
        }
    });
}

document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault();
    const inputText = document.getElementById('input-field').value;
    if (selectedPrinter) {
        const cpclCommands = `
            ! 0 200 200 210 1
            TEXT 4 0 30 40 ${inputText}
            FORM
            PRINT
        `;
        browserPrint.printTagged(selectedPrinter, 'CPCL', cpclCommands, undefined, (result) => {
            if (result.success) {
                console.log('Printing succeeded');
                alert('Printing successful!');
            } else {
                console.error('Printing failed');
                alert('Printing failed. Please try again.');
            }
        });
    } else {
        console.error('No printer selected');
        alert('No printer selected. Please check the printer connection.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const checkPrinterBtn = document.getElementById('checkPrinterBtn');
    const resultElement = document.getElementById('result');

    checkPrinterBtn.addEventListener('click', () => {
        findPrinter();
        if (selectedPrinter) {
            resultElement.textContent = 'Printer is connected';
        } else {
            resultElement.textContent = 'Printer is not connected';
        }
    });
});