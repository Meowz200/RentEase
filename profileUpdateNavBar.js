const themeSwitch = document.getElementById("theme-switch");
const logoutButton = document.querySelector('.logOutBtn');

// Function to apply the theme based on localStorage
function applyTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeSwitch.checked = true;
    } else {
        document.body.classList.remove('dark-theme');
        themeSwitch.checked = false;
    }
}
applyTheme();

// Event listener for the theme switch toggle
themeSwitch.addEventListener("change", () => {
    document.body.classList.toggle("dark-theme");

    // Update localStorage based on the current state
    if (document.body.classList.contains("dark-theme")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});

// Dropdown Menu Toggle
const dropdownToggle = document.querySelector(".dropdown-toggle");
const dropdownMenu = document.querySelector(".dropdown-menu");

dropdownToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle("active");
    const isActive = dropdownMenu.classList.contains("active");
    dropdownToggle.setAttribute("aria-expanded", isActive);
});

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
    if (!dropdownMenu.contains(e.target) && e.target !== dropdownToggle) {
        dropdownMenu.classList.remove("active");
        dropdownToggle.setAttribute("aria-expanded", false);
    }
});

// Logout functionality
logoutButton.addEventListener("click", () => {
    localStorage.removeItem("loggedUser");
    window.location.href = "index.html";
});
