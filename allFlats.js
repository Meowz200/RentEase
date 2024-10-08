document.addEventListener("DOMContentLoaded", () => {
    populateFilterOptions();
    displayAllApartments();
    setupFavoriteButtons();
    setupDropdownToggle();
    setupThemeToggle();
    setupLogout();
    applyTheme();

    // Set up the filter form submission
    const filterForm = document.getElementById("filterForm");
    filterForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent page reload
        const minPrice = document.getElementById("min-price").value;
        const maxPrice = document.getElementById("max-price").value;
        const city = document.getElementById("filter-city").value;
        const size = document.getElementById("size").value;

        displayAllApartments(minPrice, maxPrice, city, size);
    });
});

// Function to populate filter options
function populateFilterOptions() {
    const allApartments = JSON.parse(localStorage.getItem("allApartments")) || [];
    const citySelect = document.getElementById("filter-city");
    const sizeSelect = document.getElementById("size");

    // To store unique cities and sizes
    const cities = new Set();
    const sizes = new Set();

    allApartments.forEach(apartment => {
        if (apartment.city) cities.add(apartment.city);
        if (apartment.areaSize) sizes.add(apartment.areaSize);
    });

    // Populate city dropdown
    cities.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });

    // Populate size dropdown
    sizes.forEach(size => {
        const option = document.createElement("option");
        option.value = size;
        option.textContent = `${size} sq ft`;
        sizeSelect.appendChild(option);
    });
}

// Function to display all apartments from localStorage with optional filtering
function displayAllApartments(minPrice, maxPrice, city, size) {
    const houseGrid = document.getElementById("houseGrid");
    houseGrid.innerHTML = ""; // Clear existing content

    const allApartments = JSON.parse(localStorage.getItem("allApartments")) || [];

    // Filter apartments based on criteria
    const filteredApartments = allApartments.filter(apartment => {
        const price = apartment.rentPrice || 0;
        const apartmentCity = apartment.city || '';
        const areaSize = apartment.areaSize || 0;

        const isPriceValid = (minPrice ? price >= minPrice : true) && (maxPrice ? price <= maxPrice : true);
        const isCityValid = (city ? apartmentCity.toLowerCase().includes(city.toLowerCase()) : true);
        const isSizeValid = (size ? areaSize >= size : true);

        return isPriceValid && isCityValid && isSizeValid;
    });

    if (filteredApartments.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No apartments available that match your criteria.";
        message.style.fontSize = "1.2rem";
        message.style.color = "#555";
        houseGrid.appendChild(message);
        return;
    }

    filteredApartments.forEach((apartment, index) => {
        const houseCard = createHouseCard(apartment, index);
        houseGrid.appendChild(houseCard);
    });
}

// Function to create a house card element
function createHouseCard(apartment, index) {
    const houseCard = document.createElement("div");
    houseCard.classList.add("house-card");

    const houseImage = document.createElement("img");
    houseImage.src = apartment.image || "Images/png/download.jpg";
    houseImage.alt = "House Image";
    houseImage.classList.add("house-image");
    houseCard.appendChild(houseImage);

    const houseDetails = document.createElement("div");
    houseDetails.classList.add("house-details");

    const houseTitle = document.createElement("h3");
    houseTitle.classList.add("house-title");
    houseTitle.textContent = apartment.apartmentName || "Modern Apartment";
    houseDetails.appendChild(houseTitle);

    houseDetails.appendChild(createDetailElement("City: ", apartment.city));
    houseDetails.appendChild(createDetailElement("Street Name: ", apartment.streetName));
    houseDetails.appendChild(createDetailElement("Street Number: ", apartment.streetNumber));
    houseDetails.appendChild(createDetailElement("Year Built: ", apartment.yearBuilt));
    houseDetails.appendChild(createDetailElement("Date Available: ", formatDate(apartment.dateAvailable)));
    houseDetails.appendChild(createDetailElement("Has AC? ", apartment.hasAc ? "Yes" : "No"));
    houseDetails.appendChild(createDetailElement("Size: ", `${apartment.areaSize || "N/A"} sq ft`));
    houseDetails.appendChild(createDetailElement("Rent Price: ", `$${apartment.rentPrice || "N/A"}`));

    // Favorite button
    const favoriteButton = document.createElement("button");
    favoriteButton.classList.add("add-button");
    favoriteButton.dataset.apartmentIndex = index;
    favoriteButton.textContent = "Favorite";

    // Check if the apartment is already in favorites and update button state accordingly
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    if (loggedUser && loggedUser.favorites && loggedUser.favorites.some(fav => fav.apartmentName === apartment.apartmentName)) {
        favoriteButton.textContent = "Favorited";
        favoriteButton.disabled = true;
    }

    houseDetails.appendChild(favoriteButton);

    // Remove button
    const removeButton = document.createElement("button");
    removeButton.classList.add("remove-button");
    removeButton.textContent = "Remove";
    removeButton.dataset.apartmentIndex = index;
    houseDetails.appendChild(removeButton);

    houseCard.appendChild(houseDetails);
    return houseCard;
}

// Helper function to create a detail paragraph
function createDetailElement(label, value) {
    const paragraph = document.createElement("p");
    paragraph.classList.add("house-description");
    paragraph.textContent = `${label}${value || "N/A"}`;
    return paragraph;
}

// Function to format date from YYYY-MM-DD to MM/DD/YYYY
function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date)) return "Invalid Date";
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

// Function to handle favorite and remove button clicks
function setupFavoriteButtons() {
    const houseGrid = document.getElementById("houseGrid");
    houseGrid.addEventListener("click", (event) => {
        if (event.target.classList.contains("add-button")) {
            const apartmentIndex = event.target.dataset.apartmentIndex;
            addApartmentToFavorites(apartmentIndex, event.target);
        } else if (event.target.classList.contains("remove-button")) {
            const apartmentIndex = event.target.dataset.apartmentIndex;
            removeApartmentFromAllApartments(apartmentIndex);
        }
    });
}

// Function to add an apartment to the user's favorites
function addApartmentToFavorites(index, button) {
    const allApartments = JSON.parse(localStorage.getItem("allApartments")) || [];
    const apartment = allApartments[index];
    
    if (!apartment) {
        alert("Apartment not found.");
        return;
    }

    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    
    if (!loggedUser) {
        alert("User not logged in.");
        return;
    }

    if (!loggedUser.favorites) {
        loggedUser.favorites = [];
    }

    // Check if the apartment is already in favorites
    const isAlreadyFavorited = loggedUser.favorites.some(fav => fav.apartmentName === apartment.apartmentName);
    
    if (isAlreadyFavorited) {
        alert("This apartment is already in your favorites.");
        return;
    }

    // Add to favorites
    loggedUser.favorites.push(apartment);
    localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

    // Update button state
    button.textContent = "Favorited";
    button.disabled = true;

    alert("Apartment added to favorites!");
}

// Function to remove an apartment from the allApartments array
function removeApartmentFromAllApartments(index) {
    const allApartments = JSON.parse(localStorage.getItem('allApartments')) || [];

    index = Number(index);

    if (index < 0 || index >= allApartments.length) {
        alert("Invalid apartment index.");
        return;
    }

    // Confirm removal
    const confirmRemoval = confirm("Are you sure you want to remove this apartment?");
    if (!confirmRemoval) return;

    allApartments.splice(index, 1);
    localStorage.setItem('allApartments', JSON.stringify(allApartments));

    // Refresh the apartment display
    displayAllApartments();

    alert("Apartment removed from all apartments.");
}

// Function to set up the dropdown toggle functionality
function setupDropdownToggle() {
    const dropdownToggle = document.getElementById("dropdownButton");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    dropdownToggle.addEventListener("click", () => {
        dropdownMenu.classList.toggle("active");
    });

    document.addEventListener("click", (event) => {
        if (!dropdownToggle.contains(event.target) && !dropdownMenu.contains(event.target)) {
            dropdownMenu.classList.remove("active");
        }
    });
}

// Function to set up the theme toggle functionality
function setupThemeToggle() {
    const themeSwitch = document.getElementById("theme-switch");

    themeSwitch.addEventListener("change", () => {
        if (themeSwitch.checked) {
            document.body.classList.add("dark-theme");
            localStorage.setItem("theme", "dark");
        } else {
            document.body.classList.remove("dark-theme");
            localStorage.setItem("theme", "light");
        }
    });
}

// Function to apply the theme based on localStorage
function applyTheme() {
    const themeSwitch = document.getElementById("theme-switch");
    const currentTheme = localStorage.getItem("theme") || "light";
    if (currentTheme === "dark") {
        document.body.classList.add("dark-theme");
        themeSwitch.checked = true;
    }
}

// Function to set up logout functionality
function setupLogout() {
    const logoutLink = document.getElementById("logoutLink");
    logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("loggedUser");
        window.location.href = "index.html";
    });
}
