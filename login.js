document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('https://192.168.10.250/loginapi/index.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log(data, 'datass')
        if (response.ok) {
            console.log('Login successful:', data);
            localStorage.setItem('jwt', data.jwt);
            localStorage.setItem('loggedInUserEmail', email);
            window.location.href = 'dashboard.html';
        } else {
            console.error('Login failed:', data.message);
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
});