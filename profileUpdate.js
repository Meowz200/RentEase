document.addEventListener("DOMContentLoaded", () => {
    const updateButton = document.querySelector(".updateBtn");
    const fullNameInput = document.querySelector('input[placeholder="Full Name"]');
    const firstNameInput = document.querySelector('input[placeholder="First Name"]');
    const lastNameInput = document.querySelector('input[placeholder="Last Name"]');
    const emailInput = document.querySelector('input[placeholder="Email"]');
    const newPasswordInput = document.querySelector('input[placeholder="New Password"]');
    const confirmPasswordInput = document.querySelector('input[placeholder="Confirm"]');
    const birthdateInput = document.querySelector('input[type="date"]');

    // Add blur event listeners for validation
    fullNameInput.addEventListener("blur", () => validateFullName(fullNameInput));
    firstNameInput.addEventListener("blur", () => validateFirstName(firstNameInput));
    lastNameInput.addEventListener("blur", () => validateLastName(lastNameInput));
    emailInput.addEventListener("blur", () => validateEmail(emailInput));
    newPasswordInput.addEventListener("blur", () => validatePassword(newPasswordInput, confirmPasswordInput));
    confirmPasswordInput.addEventListener("blur", () => validatePassword(confirmPasswordInput, newPasswordInput));
    birthdateInput.addEventListener("blur", () => validateBirthdate(birthdateInput));

    updateButton.addEventListener("click", (event) => {
        event.preventDefault();

        const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
        const users = JSON.parse(localStorage.getItem("users")) || [];

        if (!loggedUser) {
            alert("No user is logged in.");
            return;
        }

        // Get input values
        const fullName = fullNameInput.value.trim();
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const email = emailInput.value.trim();
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        const birthdate = birthdateInput.value;

        // Perform validation
        const isValidFullName = validateFullName(fullNameInput);
        const isValidFirstName = validateFirstName(firstNameInput);
        const isValidLastName = validateLastName(lastNameInput);
        const isValidEmail = validateEmail(emailInput);
        const isValidBirthdate = validateBirthdate(birthdateInput);
        const isValidNewPassword = validatePassword(newPasswordInput, confirmPasswordInput);
        const isValidConfirmPassword = validatePassword(confirmPasswordInput, newPasswordInput);

        // Check if all validations pass
        if (!isValidFullName || !isValidFirstName || !isValidLastName || !isValidEmail || !isValidBirthdate || !isValidNewPassword || !isValidConfirmPassword) {
            return; // Stop the update if any validation fails
        }

        // Find the user in the users array using the current loggedUser's email
        const currentUserEmail = loggedUser.emailProperty;
        const userIndex = users.findIndex((user) => user.emailProperty === currentUserEmail);

        if (userIndex !== -1) {
            users[userIndex] = {
                ...users[userIndex],
                fullNameProperty: fullName,
                firstNameProperty: firstName,
                lastNameProperty: lastName,
                emailProperty: email,
                birthdateProperty: birthdate,
                ...(newPassword && { passwordProperty: newPassword })
            };

            localStorage.setItem("users", JSON.stringify(users));

            // Update the loggedUser object with the new information
            loggedUser.fullNameProperty = fullName;
            loggedUser.firstNameProperty = firstName;
            loggedUser.lastNameProperty = lastName;
            loggedUser.emailProperty = email;
            loggedUser.birthdateProperty = birthdate;
            if (newPassword) {
                loggedUser.passwordProperty = newPassword; 
            }

            localStorage.setItem("loggedUser", JSON.stringify(loggedUser));

            alert("Profile updated successfully!");

            window.location.href = '/index.html';
        } else {
            console.error("User not found in users array.");
            alert("User not found.");
        }
    });
});

/**
 * Function to validate full name
 */
function validateFullName(input) {
    const fullName = input.value.trim();
    if (!fullName) {
        displayError(input, 'Full Name is required.');
        return false;
    }
    clearError(input);
    return true;
}

/**
 * Function to validate first name
 */
function validateFirstName(input) {
    const firstName = input.value.trim();
    if (!firstName) {
        displayError(input, 'First Name is required.');
        return false;
    }
    clearError(input);
    return true;
}

/**
 * Function to validate last name
 */
function validateLastName(input) {
    const lastName = input.value.trim();
    if (!lastName) {
        displayError(input, 'Last Name is required.');
        return false;
    }
    clearError(input);
    return true;
}

/**
 * Function to validate email
 */
function validateEmail(input) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = input.value.trim();
    if (!email) {
        displayError(input, 'Email is required.');
        return false;
    }
    if (!emailRegex.test(email)) {
        displayError(input, 'Please enter a valid email address.');
        return false;
    }
    clearError(input);
    return true;
}

/**
 * Function to validate password  (At least 6 characters, 1 uppercase, 1 number, 1 special character)
 */
function validatePassword(passwordInput, confirmInput) {
    const password = passwordInput.value.trim();
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!password) {
        displayError(passwordInput, 'Password is required.');
        return false;
    }
    if (!passwordRegex.test(password)) {
        displayError(passwordInput, 'Password must be at least 6 characters long and include at least one uppercase letter, one number, and one special character.');
        return false;
    }
    if (password !== confirmInput.value.trim()) {
        displayError(confirmInput, 'Passwords do not match.');
        return false;
    }
    clearError(passwordInput);
    clearError(confirmInput);
    return true;
}

/**
 * Function to validate birthdate
 */
function validateBirthdate(input) {
    const birthdateValue = input.value.trim();

    // Clear previous errors
    clearError(input);

    // Check if the input is empty
    if (!birthdateValue) {
        displayError(input, 'Birthdate is required.');
        return false;
    }

    const birthdate = new Date(birthdateValue);
    const today = new Date();
    const age = today.getFullYear() - birthdate.getFullYear();

    // Check if the user is older than 18
    if (age < 18) {
        displayError(input, 'You must be at least 18 years old.');
        return false;
    }

    // Check if the user is older than 120
    if (age > 120) {
        displayError(input, 'Age must be less than or equal to 120 years.');
        return false;
    }

    // Check if the birthdate is in the future
    if (birthdate > today) {
        displayError(input, 'Birthdate cannot be in the future.');
        return false;
    }

    return true;
}

/**
 * Function to display error message
 */
function displayError(input, message) {
    // Clear previous error
    clearError(input);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    input.parentElement.appendChild(errorElement);
}

/**
 * Function to clear error message
 */
function clearError(input) {
    const errorElement = input.parentElement.querySelector(".error-message");
    if (errorElement) {
        errorElement.remove();
    }
}
