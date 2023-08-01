document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const userData = {
            username: formData.get('username'),
            password: formData.get('password'),
        };


        fetch('http://127.0.0.1:3000/login', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => {

            if (data.success) {

                window.location.href = '/dashboard';
            } else {

                alert('Sorry the entered information does not match our records.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during login.');
        });
    });
});
