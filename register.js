let users = [];

if (localStorage.getItem("users")) {
    users = JSON.parse(localStorage.getItem("users"));
}

let fullNameVar = "";
let firstNameVar = "";
let lastNameVar = "";
let emailVar = "";
let passwordVar = "";
let birthdateVar = null;

// User constructor class 
class User {
    constructor(fullName, firstName, lastName, email, password, birthdate) {
        this.fullNameProperty = fullName;
        this.firstNameProperty = firstName;
        this.lastNameProperty = lastName;
        this.emailProperty = email;
        this.passwordProperty = password;
        this.birthdateProperty = birthdate;
    }
    favorites = []
}

// Define input elements outside the event listener
const fullNameInput = document.getElementById("fullName");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const birthdateInput = document.getElementById("birthdate");

const fullNameError = document.getElementById("fullNameError");
const firstNameError = document.getElementById("firstNameError");
const lastNameError = document.getElementById("lastNameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const birthdateError = document.getElementById("birthdateError");

const showError = (element, message) => {
    element.innerText = message;
    element.style.display = "block";
};

const hideError = (element) => {
    element.innerText = "";
    element.style.display = "none";
};

const validateFullName = () => {
    const fullName = fullNameInput.value.trim();
    if (fullName.length < 2) {
        showError(fullNameError, "Full name must be at least 2 characters.");
        return false;
    } else {
        hideError(fullNameError);
        fullNameVar = fullName;
        console.log("Full Name:", fullNameVar);
        return true;
    }
};

const validateFirstName = () => {
    const firstName = firstNameInput.value.trim();
    if (firstName.length < 2) {
        showError(firstNameError, "First name must be at least 2 characters.");
        return false;
    } else {
        hideError(firstNameError);
        firstNameVar = firstName;
        console.log("First Name:", firstNameVar);
        return true;
    }
};

const validateLastName = () => {
    const lastName = lastNameInput.value.trim();
    if (lastName.length < 2) {
        showError(lastNameError, "Last name must be at least 2 characters.");
        return false;
    } else {
        hideError(lastNameError);
        lastNameVar = lastName;
        console.log("Last Name:", lastNameVar);
        return true;
    }
};

const validateEmail = () => {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        showError(emailError, "Please enter a valid email address.");
        return false;
    }

    const emailExists = users.some(user => user.emailProperty === email);
    if (emailExists) {
        showError(emailError, "Email is already taken.");
        return false;
    } else {
        hideError(emailError);
        emailVar = email;
        console.log("Email:", emailVar);
        return true;
    }
};

const validatePassword = () => {
    const password = passwordInput.value;
    const passwordCriteria = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{6,}$/;
    if (!passwordCriteria.test(password)) {
        showError(
            passwordError,
            "Password must be at least 6 characters long and contain letters, numbers, and a special character."
        );
        return false;
    } else {
        hideError(passwordError);
        passwordVar = password;
        console.log("Password:", passwordVar);
        return true;
    }
};

const validateBirthdate = () => {
    const birthdate = new Date(birthdateInput.value);
    const today = new Date();

    if (birthdate > today) {
        showError(birthdateError, "Birthdate cannot be today or in the future.");
        return false;
    }

    let age = today.getFullYear() - birthdate.getFullYear();
    let monthDiff = today.getMonth() - birthdate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthdate.getDate())
    ) {
        age--;
    }

    if (age < 18 || age > 120) {
        showError(birthdateError, "Age must be between 18 and 120 years.");
        return false;
    } else {
        hideError(birthdateError);
        birthdateVar = birthdate;
        console.log("Birthdate:", birthdateVar);
        return true;
    }
};

const saveUser = (user) => {
    users.push(user); // Add user to the array
    localStorage.setItem("users", JSON.stringify(users));
};

const signupBtn = document.querySelector(".signupBtn");
signupBtn.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent form submission

    // Validate all fields and log values
    const isValidFullName = validateFullName();
    const isValidFirstName = validateFirstName();
    const isValidLastName = validateLastName();
    const isValidEmail = validateEmail();
    const isValidPassword = validatePassword();
    const isValidBirthdate = validateBirthdate();

    // Log the collected values only if all validations pass
    if (
        isValidFullName &&
        isValidFirstName &&
        isValidLastName &&
        isValidEmail &&
        isValidPassword &&
        isValidBirthdate
    ) {
        // Create user
        let user = new User(fullNameVar, firstNameVar, lastNameVar, emailVar, passwordVar, birthdateVar);
        console.log(user);
        saveUser(user);
        alert("User has been successfully registered!");
    }
});

// Adding blur event listeners for validation
fullNameInput.addEventListener("blur", validateFullName);
firstNameInput.addEventListener("blur", validateFirstName);
lastNameInput.addEventListener("blur", validateLastName);
emailInput.addEventListener("blur", validateEmail);
passwordInput.addEventListener("blur", validatePassword);
birthdateInput.addEventListener("blur", validateBirthdate);