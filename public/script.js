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