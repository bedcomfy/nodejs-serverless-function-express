const express = require('express');
const app = express();
const ThermalPrinter = require('node-thermal-printer').printer;
const PrinterTypes = require('node-thermal-printer').types;

app.use(express.json());

app.post('/api/print', async (req, res) => {
    const input = req.body.input;
    
    try {
        // Create a new instance of the thermal printer
        const printer = new ThermalPrinter({
            type: PrinterTypes.ZEBRA,
            interface: 'USB',
            characterSet: 'SLOVENIA',
            removeSpecialCharacters: false,
            lineCharacter: '=',
            options: {
                timeout: 5000,
            },
        });
        
        // Initialize the printer
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
            
            // Create the CPCL commands
            const cpclCommands = `
                ! 0 200 200 210 1
                TEXT 4 0 30 40 ${input}
                FORM
                PRINT
            `;
            
            // Send the CPCL commands to the printer
            printer.println(cpclCommands);
            
            // Disconnect from the printer
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