document.addEventListener("DOMContentLoaded", () => {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    if (loggedUser && loggedUser.lastNameProperty) {
        const greetingElement = document.querySelector('.greeting');
        greetingElement.textContent = `Hello, ${loggedUser.lastNameProperty}`;
    } else {
        console.error('No logged user found or missing last name.');
    }
});