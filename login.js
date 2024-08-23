// Add event listener to the login form submission
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission behavior
    handleLogin();
});

// Handle the login process
function handleLogin() {
    // Retrieve email and password input values
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Retrieve stored users from local storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find the user with matching email and password
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        // Store user information in local storage
        localStorage.setItem('loggedInUserName', user.name);
        localStorage.setItem('loggedInUserEmail', user.email);
        // Redirect to the home page
        window.location.href = 'home.html';
    } else {
        // Show an alert if the login fails
        alert('Invalid email or password');
    }
}
