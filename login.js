let users = [];

// Retrieve existing users from localStorage if available
if (localStorage.getItem("users")) {
    users = JSON.parse(localStorage.getItem("users"));
}

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

// Show error message function
const showError = (element, message) => {
    element.innerText = message;
    element.style.display = "block";
};

// Hide error message function
const hideError = (element) => {
    element.innerText = "";
    element.style.display = "none";
};

// Validate email function
const validateEmail = (email) => {
    return users.some(user => user.emailProperty === email);
};

// Validate password function
const validatePassword = (email, password) => {
    const user = users.find(user => user.emailProperty === email);
    return user && user.passwordProperty === password;
};

// Login button event listener
const loginBtn = document.querySelector(".loginBtn");
loginBtn.addEventListener("click", function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Reset error messages
    hideError(emailError);
    hideError(passwordError);

    // Validate email
    if (!validateEmail(email)) {
        showError(emailError, "User not found.");
        return;
    }

    // Validate password
    if (!validatePassword(email, password)) {
        showError(passwordError, "Incorrect password.");
        return;
    }

    // If login is successful, save the user in loggedUser
    const loggedUser = users.find(user => user.emailProperty === email);
    localStorage.setItem("loggedUser", JSON.stringify(loggedUser));

    window.location.href = '/home.html';
});

// Blur event listeners for validation
emailInput.addEventListener("blur", function () {
    const email = emailInput.value.trim();
    if (!validateEmail(email)) {
        showError(passwordError, "Incorrect Email or Password");
    } else {
        hideError(passwordError);
    }
});

passwordInput.addEventListener("blur", function () {
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (validateEmail(email) && !validatePassword(email, password)) {
        showError(passwordError, "Incorrect Email or Password");
    } else {
        hideError(passwordError);
    }
});
