document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('input-field').value;
    
    try {
        const response = await fetch('/api/print', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ input })
        });
        
        if (response.ok) {
            alert('Printing successful!');
        } else {
            alert('Printing failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const checkPrinterBtn = document.getElementById('checkPrinterBtn');
    const resultElement = document.getElementById('result');

    checkPrinterBtn.addEventListener('click', () => {
        fetch('/api/checkPrinter')
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    resultElement.textContent = data.message;
                } else if (data.error) {
                    resultElement.textContent = data.error;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                resultElement.textContent = 'An error occurred while checking the printer connection.';
            });
    });
});