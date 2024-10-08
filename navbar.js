document.addEventListener("DOMContentLoaded", function () {
    const dropdownButton = document.getElementById("dropdownButton");
    const dropdownMenu = document.querySelector(".dropdownMenu");
    const themeSwitch = document.getElementById("themeSwitch");
    const body = document.body;

    // Toggle Dropdown Menu
    dropdownButton.addEventListener("click", function (e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle("active");
    });

    // Close Dropdown if Clicked Outside
    window.addEventListener("click", function (event) {
        if (!dropdownButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("active");
        }
    });

    // Toggle Dark Theme
    themeSwitch.addEventListener("change", function () {
        if (this.checked) {
            body.classList.add("darkTheme");
        } else {
            body.classList.remove("darkTheme");
        }
    });
});