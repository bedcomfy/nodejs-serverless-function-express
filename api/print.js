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

// Endpoint to handle printing
app.post('/api/print', async (req, res) => {
    const input = req.body.input;
    
    try {
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
                res.status(500).json({ error: 'An error occurred while connecting to the printer' });
                return;
            }
            
            if (!isConnected) {
                console.error('Printer is not connected');
                res.status(500).json({ error: 'Printer is not connected' });
                return;
            }
            
            const cpclCommands = `
                ! 0 200 200 210 1
                TEXT 4 0 30 40 ${input}
                FORM
                PRINT
            `;
            
            printer.println(cpclCommands);
            
            printer.beep();
            printer.cut();
            printer.execute(() => {
                printer.clear();
                printer.disconnect();
                res.status(200).json({ message: 'Printing successful' });
            });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while printing' });
    }
});

module.exports = app;