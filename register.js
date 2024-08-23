// Initialize the registration page
document.addEventListener('DOMContentLoaded', function () {
    handleEditInfo(); // Check if the user is editing their info
    document.getElementById('registration').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission behavior
        handleRegistration(); // Handle the registration or update process
    });
});

// Handle the editing of user information
function handleEditInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const isEditing = urlParams.get('edit') === 'true';

    if (isEditing) {
        // Get the email of the logged-in user
        const email = localStorage.getItem('loggedInUserEmail');
        // Retrieve users from local storage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        // Find the user with the matching email
        const user = users.find(user => user.email === email);

        if (user) {
            // Populate the form fields with existing user information
            document.getElementById('formTitle').textContent = 'Edit Info';
            document.getElementById('name').value = user.name;
            document.getElementById('email').value = user.email;
            document.getElementById('password').value = user.password;
            document.getElementById('contact').value = user.contact;
            document.getElementById('submitButton').textContent = 'Save Changes';
        }
    }
}

// Handle user registration or information update
function handleRegistration() {
    // Retrieve input values from the form
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const contact = document.getElementById('contact').value;

    // Validate form inputs
    if (!validateForm(password, email, contact)) return;

    // Retrieve users from local storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUserIndex = users.findIndex(user => user.email === email);

    let customerId;
    if (existingUserIndex !== -1) {
        // Update existing user information
        users[existingUserIndex] = { name, email, password, contact };
        customerId = users[existingUserIndex].id;
    } else {
        // Add new user
        customerId = "CUST" + Math.floor(Math.random() * 100000);
        users.push({ id: customerId, name, email, password, contact });
    }

    // Save updated users list to local storage
    localStorage.setItem('users', JSON.stringify(users));

    // Show success notification
    showSuccessNotification(customerId, name, email);

    // Redirect based on whether the user is editing or registering
    const isEditing = new URLSearchParams(window.location.search).get('edit') === 'true';
    setTimeout(() => {
        window.location.href = isEditing ? 'home.html' : 'login.html';
    }, 3000); // 3 seconds delay to allow the user to see the notification
}

// Validate the registration form inputs
function validateForm(password, email, contact) {
    const passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailReg = /\S+@\S+\.\S+/;
    const contactReg = /^\d{10}$/;

    if (!passReg.test(password)) {
        alert("Password should contain 1 special character, one capital letter, one small letter, and a digit.");
        return false;
    }

    if (!emailReg.test(email)) {
        alert("Invalid email.");
        return false;
    }

    if (!contactReg.test(contact)) {
        alert("Contact number should be 10 digits.");
        return false;
    }

    return true;
}

// Show success notification
function showSuccessNotification(customerId, name, email) {
    const notification = document.getElementById('notification');
    notification.textContent = `Registration successful! Customer ID: ${customerId}, Name: ${name}, Email: ${email}`;
    notification.classList.add('success');
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000 ); // Hide the notification after 3 seconds
}
