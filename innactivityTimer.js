let inactivityTimer;
let warningTimer;
const INACTIVITY_LIMIT = 60 *60 * 1000;
const WARNING_TIME = 15;

// Function to initialize the inactivity tracker
function initInactivityTracker() {
    // Reset the inactivity timer when user moves mouse
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keypress', resetInactivityTimer);

    startInactivityTimer();
}

// Function to start the inactivity timer
function startInactivityTimer() {
    inactivityTimer = setTimeout(showWarningPopup, INACTIVITY_LIMIT);
}

// Function to reset the inactivity timer
function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    clearTimeout(warningTimer);
    hideWarningPopup();
    startInactivityTimer();
}

// Function to show warning popup
function showWarningPopup() {
    // Create the popup
    const popup = document.createElement('div');
    popup.id = 'inactivityPopup';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = '#f9f9f9';
    popup.style.padding = '20px';
    popup.style.border = '1px solid #ccc';
    popup.style.zIndex = 1000;
    popup.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    popup.style.borderRadius = '8px';

    const title = document.createElement('h2');
    title.textContent = "Inactivity Warning";
    title.style.marginBottom = '10px';
    title.style.color = '#333';

    const message = document.createElement('p');
    message.textContent = "You have been inactive for 60 minutes. You will be logged out in:";
    message.style.marginBottom = '10px';
    message.style.color = '#555';

    const countdownDisplay = document.createElement('span');
    countdownDisplay.id = 'countdown';
    countdownDisplay.style.fontSize = '24px';
    countdownDisplay.style.color = '#e74c3c';
    countdownDisplay.textContent = WARNING_TIME;

    popup.appendChild(title);
    popup.appendChild(message);
    popup.appendChild(countdownDisplay);
    document.body.appendChild(popup);

    startWarningTimer(countdownDisplay);
}

// Function to start the warning countdown
function startWarningTimer(display) {
    let countdown = WARNING_TIME;
    warningTimer = setInterval(() => {
        countdown--;
        display.textContent = countdown;

        if (countdown <= 0) {
            clearInterval(warningTimer);
            logOutUser();
        }
    }, 1000);
}

// Function to hide the warning popup
function hideWarningPopup() {
    const popup = document.getElementById('inactivityPopup');
    if (popup) {
        document.body.removeChild(popup);
    }
}

// Function to log out the user
function logOutUser() {
    alert("You have been logged out due to inactivity.");
    localStorage.removeItem('loggedUser');
    window.location.href = "index.html";
}

// Initialize the inactivity tracker when the page loads
document.addEventListener('DOMContentLoaded', initInactivityTracker);
