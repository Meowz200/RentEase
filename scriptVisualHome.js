const themeSwitch = document.getElementById("themeSwitch");

// Function to apply the theme based on localStorage
function applyTheme() {
  const currentTheme = localStorage.getItem("theme") || "light";
  if (currentTheme === "dark") {
    document.body.classList.add("darkTheme");
    themeSwitch.checked = true;
  } else {
    document.body.classList.remove("darkTheme");
    themeSwitch.checked = false;
  }
}

// Call applyTheme to set the initial theme on page load
applyTheme();

themeSwitch.addEventListener("change", () => {
  // Toggle the dark theme class on the body
  document.body.classList.toggle("darkTheme");

  // Update localStorage based on the current state
  if (document.body.classList.contains("darkTheme")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

// Dropdown Menu Toggle
const dropdownToggle = document.querySelector(".dropdownToggle");
const dropdownMenu = document.querySelector(".dropdownMenu");

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
// Delete user logic
const deleteUserButton = document.getElementById("deleteCurrentUser");

deleteUserButton.addEventListener("click", () => {
    const confirmation = confirm(
        "Are you sure you want to delete your account permanently?"
    );
    if (confirmation) {
        // Retrieve loggedUser object from localStorage
        const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

        if (!loggedUser || !loggedUser.emailProperty) {
            alert("No logged-in user found.");
            return;
        }

        // Retrieve users from localStorage and parse it into an array
        let users = JSON.parse(localStorage.getItem("users")) || [];

        // Log the logged user email and users array for debugging
        console.log("Logged user email:", loggedUser.emailProperty);
        console.log("Users before deletion:", users);

        // Check if the user exists in the users array and remove it
        const userExists = users.some((user) => user.emailProperty === loggedUser.emailProperty);

        if (userExists) {
            // Filter out the user with the matching emailProperty
            users = users.filter((user) => user.emailProperty !== loggedUser.emailProperty);
            
            // Save the updated users array back to localStorage
            localStorage.setItem("users", JSON.stringify(users));

            // Clear loggedUser from localStorage
            localStorage.removeItem("loggedUser");

            alert("Your account has been deleted.");
            window.location.href = "index.html";
        } else {
            alert("User not found in the system.");
        }
    }
});
