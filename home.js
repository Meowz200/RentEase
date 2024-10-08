document.addEventListener("DOMContentLoaded", () => {
    initializeApartments();
    applyTheme();
    displayFavoriteApartments();
    setupRemoveButtons();
    setupLogout();
    setupFilter();
    populateFilterInputs();
});

// Function to initialize apartments in localStorage
function initializeApartments() {
    const existingApartments = localStorage.getItem('allApartments');
    if (!existingApartments) {
        localStorage.setItem('allApartments', JSON.stringify([]));
    }
}

// Function to display favorite apartments
function displayFavoriteApartments(filteredApartments = null) {
    const houseGrid = document.getElementById("houseGrid");
    houseGrid.innerHTML = "";

    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

    // Check if loggedUser and favorites array exist
    if (!loggedUser || !loggedUser.favorites || loggedUser.favorites.length === 0) {
        const message = document.createElement("p");
        message.textContent = "You have no favorite apartments.";
        message.style.fontSize = "1.2rem";
        message.style.color = "#555";
        houseGrid.appendChild(message);
        return;
    }

    // If no filtered apartments, use all favorites
    const apartmentsToDisplay = filteredApartments || loggedUser.favorites;

    // Iterate through each favorite apartment and create a card
    apartmentsToDisplay.forEach((apartment, index) => {
        const houseCard = createHouseCard(apartment, index);
        houseGrid.appendChild(houseCard);
    });
}

// Function to create a house card element
function createHouseCard(apartment, index) {
    const houseCard = document.createElement("div");
    houseCard.classList.add("houseCard");

    const houseImage = document.createElement("img");
    houseImage.src = apartment.image || "/Images/png/download.jpg";
    houseImage.alt = "House Image";
    houseImage.classList.add("houseImage");
    houseCard.appendChild(houseImage);

    const houseDetails = document.createElement("div");
    houseDetails.classList.add("houseDetails");

    const houseTitle = document.createElement("h3");
    houseTitle.classList.add("houseTitle");
    houseTitle.textContent = apartment.apartmentName || "Modern Apartment";
    houseDetails.appendChild(houseTitle);

    const city = document.createElement("p");
    city.classList.add("houseDescription");
    city.textContent = `City: ${apartment.city || "N/A"}`;
    houseDetails.appendChild(city);

    const streetName = document.createElement("p");
    streetName.classList.add("houseDescription");
    streetName.textContent = `Street Name: ${apartment.streetName || "N/A"}`;
    houseDetails.appendChild(streetName);

    const streetNumber = document.createElement("p");
    streetNumber.classList.add("houseDescription");
    streetNumber.textContent = `Street Number: ${apartment.streetNumber || "N/A"}`;
    houseDetails.appendChild(streetNumber);

    const yearBuilt = document.createElement("p");
    yearBuilt.classList.add("houseDescription");
    yearBuilt.textContent = `Year Built: ${apartment.yearBuilt || "N/A"}`;
    houseDetails.appendChild(yearBuilt);

    const dateAvailable = document.createElement("p");
    dateAvailable.classList.add("houseDescription");
    dateAvailable.textContent = `Date Available: ${formatDate(apartment.dateAvailable)}`;
    houseDetails.appendChild(dateAvailable);

    const hasAc = document.createElement("p");
    hasAc.classList.add("houseDescription");
    hasAc.textContent = `Has AC? ${apartment.hasAc ? "Yes" : "No"}`;
    houseDetails.appendChild(hasAc);

    const areaSize = document.createElement("p");
    areaSize.classList.add("houseSize");
    areaSize.textContent = `Size: ${apartment.areaSize || "N/A"} sq ft`;
    houseDetails.appendChild(areaSize);

    const rentPrice = document.createElement("p");
    rentPrice.classList.add("housePrice");
    rentPrice.textContent = `$${apartment.rentPrice || "N/A"}`;
    houseDetails.appendChild(rentPrice);

    const removeButton = document.createElement("button");
    removeButton.classList.add("removeButton");
    removeButton.textContent = "Remove";
    removeButton.dataset.apartmentIndex = index;
    houseDetails.appendChild(removeButton);

    houseCard.appendChild(houseDetails);

    return houseCard;
}

// Function to format date
function formatDate(dateStr) {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date)) return "Invalid Date";
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

// Function to handle remove button clicks
function setupRemoveButtons() {
    const houseGrid = document.getElementById("houseGrid");
    houseGrid.addEventListener("click", (event) => {
        if (event.target.classList.contains("removeButton")) {
            const apartmentIndex = event.target.dataset.apartmentIndex;
            removeApartmentFromFavorites(apartmentIndex);
        }
    });
}

// Function to remove an apartment from the user's favorites
function removeApartmentFromFavorites(index) {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

    if (!loggedUser || !loggedUser.favorites) {
        alert("No favorites found.");
        return;
    }

    index = Number(index);

    if (index < 0 || index >= loggedUser.favorites.length) {
        alert("Invalid apartment index.");
        return;
    }

    const confirmRemoval = confirm("Are you sure you want to remove this apartment from your favorites?");
    if (!confirmRemoval) return;

    loggedUser.favorites.splice(index, 1);
    localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

    displayFavoriteApartments();

    alert("Apartment removed from favorites.");
}

// Function to apply the theme based on localStorage
function applyTheme() {
    const themeSwitch = document.getElementById("themeSwitch");
    const currentTheme = localStorage.getItem("theme") || "light";
    if (currentTheme === "dark") {
        document.body.classList.add("darkTheme");
        themeSwitch.checked = true;
    }
}

// Function to set up logout functionality
function setupLogout() {
    const logoutLink = document.getElementById("logoutLink");

    logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        const confirmLogout = confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));

            if (loggedUser && loggedUser.favorites) {
                const users = JSON.parse(localStorage.getItem('users')) || [];

                const userIndex = users.findIndex(user => user.username === loggedUser.username);

                if (userIndex !== -1) {
                    users[userIndex].favorites = loggedUser.favorites;
                }
                localStorage.setItem('users', JSON.stringify(users));
            }

            localStorage.removeItem('loggedUser');
            window.location.href = "index.html";
        }
    });
}

// Function to set up filter functionality
function setupFilter() {
    const filterForm = document.getElementById("filterForm");

    filterForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Prevent page reload

        const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
        const maxPrice = parseFloat(document.getElementById("maxPrice").value) || Infinity;
        const filterCity = document.getElementById("filterCity").value.toLowerCase();
        const filterSize = parseFloat(document.getElementById("filterSize").value) || 0;

        const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
        const apartments = loggedUser.favorites || [];

        const filteredApartments = apartments.filter(apartment => {
            const priceMatch = apartment.rentPrice >= minPrice && apartment.rentPrice <= maxPrice;
            const cityMatch = filterCity ? apartment.city.toLowerCase() === filterCity : true;
            const sizeMatch = apartment.areaSize >= filterSize;

            return priceMatch && cityMatch && sizeMatch;
        });

        displayFavoriteApartments(filteredApartments);
    });
}

// Function to populate filter inputs with existing values
function populateFilterInputs() {
    const loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    const apartments = loggedUser.favorites || [];

    const citySelect = document.getElementById("filterCity");
    const uniqueCities = new Set(apartments.map(apartment => apartment.city));
    uniqueCities.forEach(city => {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });

    const sizeSelect = document.getElementById("filterSize");
    const uniqueSizes = new Set(apartments.map(apartment => apartment.areaSize));
    uniqueSizes.forEach(size => {
        const option = document.createElement("option");
        option.value = size;
        option.textContent = size;
        sizeSelect.appendChild(option);
    });
}
