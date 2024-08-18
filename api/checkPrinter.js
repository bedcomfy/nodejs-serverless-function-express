const express = require('express');
const app = express();
const ThermalPrinter = require('node-thermal-printer').printer;
const PrinterTypes = require('node-thermal-printer').types;

app.use(express.json());

// Endpoint to check printer connection
app.get('/api/checkPrinter', (req, res) => {
    const printer = new ThermalPrinter({
        type: PrinterTypes.ZEBRA,
        interface: 'bluetooth',
        characterSet: 'SLOVENIA',
        removeSpecialCharacters: false,
        lineCharacter: '=',
        options: {
            timeout: 5000,
        },
    });

    printer.isPrinterConnected((err, isConnected) => {
        if (err) {
            console.error('Error:', err);
            res.status(500).json({ error: 'An error occurred while checking the printer connection' });
        } else {
            if (isConnected) {
                res.status(200).json({ message: 'Printer is connected' });
            } else {
                res.status(404).json({ error: 'Printer is not connected' });
            }
        }
        printer.disconnect();
    });
});

module.exports = app;