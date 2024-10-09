document.addEventListener("DOMContentLoaded", () => {
    const themeSwitch = document.getElementById('themeSwitch');

    setupLogout();

    // Function to apply the theme based on localStorage
    function applyTheme() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        if (currentTheme === 'dark') {
            document.body.classList.add('darkTheme');
            themeSwitch.checked = true;
        } else {
            document.body.classList.remove('darkTheme');
            themeSwitch.checked = false;
        }
    }
    applyTheme();

    // Event listener for the theme switch toggle
    themeSwitch.addEventListener('change', () => {
        document.body.classList.toggle('darkTheme');

        // Update localStorage based on the current state
        if (document.body.classList.contains('darkTheme')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });

    const apartmentForm = document.getElementById("apartmentForm");

    const cityInput = document.getElementById("city");
    const apartmentNameInput = document.getElementById("apartmentName");
    const streetNameInput = document.getElementById("streetName");
    const streetNumberInput = document.getElementById("streetNumber");
    const imageUploadInput = document.getElementById("imageUpload");
    const areaSizeInput = document.getElementById("areaSize");
    const hasAcInput = document.getElementById("hasAc");
    const yearBuiltInput = document.getElementById("yearBuilt");
    const rentPriceInput = document.getElementById("rentPrice");
    const dateAvailableInput = document.getElementById("dateAvailable");

    const cityError = document.getElementById("cityError");
    const apartmentNameError = document.getElementById("apartmentNameError");
    const streetNameError = document.getElementById("streetNameError");
    const streetNumberError = document.getElementById("streetNumberError");
    const imageUploadError = document.getElementById("imageUploadError");
    const areaSizeError = document.getElementById("areaSizeError");
    const yearBuiltError = document.getElementById("yearBuiltError");
    const rentPriceError = document.getElementById("rentPriceError");
    const dateAvailableError = document.getElementById("dateAvailableError");

    // Show error message function
    const showError = (element, message) => {
        element.innerText = message;
        element.classList.add('show');
    };

    // Hide error message function
    const hideError = (element) => {
        element.innerText = "";
        element.classList.remove('show');
    };

    // Apartment constructor class
    class Apartment {
        constructor(city, apartmentName, streetName, streetNumber, image, areaSize, hasAc, yearBuilt, rentPrice, dateAvailable) {
            this.city = city;
            this.apartmentName = apartmentName;
            this.streetName = streetName;
            this.streetNumber = streetNumber;
            this.image = image;
            this.areaSize = areaSize;
            this.hasAc = hasAc;
            this.yearBuilt = yearBuilt;
            this.rentPrice = rentPrice;
            this.dateAvailable = dateAvailable;
        }
    }

    // Validation functions
    const validateCity = () => {
        const city = cityInput.value.trim();
        const regex = /^[A-Za-z\s]+$/;
        if (city === "") {
            showError(cityError, "City cannot be empty.");
            return false;
        } else if (!regex.test(city)) {
            showError(cityError, "City can only contain letters and spaces.");
            return false;
        } else {
            hideError(cityError);
            return true;
        }
    };

    const validateApartmentName = () => {
        const apartmentName = apartmentNameInput.value.trim();
        const regex = /^[A-Za-z0-9\s]+$/;
        if (apartmentName === "") {
            showError(apartmentNameError, "Apartment name cannot be empty.");
            return false;
        } else if (!regex.test(apartmentName)) {
            showError(apartmentNameError, "Apartment name can only contain letters, numbers, and spaces.");
            return false;
        } else {
            hideError(apartmentNameError);
            return true;
        }
    };

    const validateStreetName = () => {
        const streetName = streetNameInput.value.trim();
        const regex = /^[A-Za-z\s]+$/;
        if (streetName === "") {
            showError(streetNameError, "Street name cannot be empty.");
            return false;
        } else if (!regex.test(streetName)) {
            showError(streetNameError, "Street name can only contain letters and spaces.");
            return false;
        } else {
            hideError(streetNameError);
            return true;
        }
    };

    const validateStreetNumber = () => {
        const streetNumber = streetNumberInput.value.trim();
        const regex = /^[A-Za-z0-9\s]+$/;
        if (streetNumber === "") {
            showError(streetNumberError, "Street number cannot be empty.");
            return false;
        } else if (!regex.test(streetNumber)) {
            showError(streetNumberError, "Street number can only contain letters, numbers, and spaces.");
            return false;
        } else {
            hideError(streetNumberError);
            return true;
        }
    };

    const validateImageUpload = () => {
        const file = imageUploadInput.files[0];
        if (!file) {
            showError(imageUploadError, "Please upload an image.");
            return false;
        }
        const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validImageTypes.includes(file.type)) {
            showError(imageUploadError, "Only JPEG, PNG, and GIF images are allowed.");
            return false;
        }
        hideError(imageUploadError);
        return true;
    };

    const validateAreaSize = () => {
        const areaSize = areaSizeInput.value.trim();
        if (areaSize === "") {
            showError(areaSizeError, "Area size cannot be empty.");
            return false;
        }
        const number = Number(areaSize);
        if (isNaN(number) || number <= 0) {
            showError(areaSizeError, "Area size must be a positive number.");
            return false;
        }
        hideError(areaSizeError);
        return true;
    };

    const validateYearBuilt = () => {
        const yearBuilt = yearBuiltInput.value.trim();
        const currentYear = new Date().getFullYear();
        if (yearBuilt === "") {
            showError(yearBuiltError, "Year built cannot be empty.");
            return false;
        }
        const number = Number(yearBuilt);
        if (isNaN(number) || number < 1800 || number > currentYear) {
            showError(yearBuiltError, `Year built must be between 1800 and ${currentYear}.`);
            return false;
        }
        hideError(yearBuiltError);
        return true;
    };

    const validateRentPrice = () => {
        const rentPrice = rentPriceInput.value.trim();
        if (rentPrice === "") {
            showError(rentPriceError, "Rent price cannot be empty.");
            return false;
        }
        const number = Number(rentPrice);
        if (isNaN(number) || number <= 0) {
            showError(rentPriceError, "Rent price must be a positive number.");
            return false;
        }
        hideError(rentPriceError);
        return true;
    };

    const validateDateAvailable = () => {
        const dateAvailable = dateAvailableInput.value;
        if (dateAvailable === "") {
            showError(dateAvailableError, "Date available cannot be empty.");
            return false;
        }
        const selectedDate = new Date(dateAvailable);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            showError(dateAvailableError, "Date available cannot be in the past.");
            return false;
        }
        hideError(dateAvailableError);
        return true;
    };

    // Function to convert image file to Base64
    const convertImageToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Function to handle form submission
    apartmentForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const isCityValid = validateCity();
        const isApartmentNameValid = validateApartmentName();
        const isStreetNameValid = validateStreetName();
        const isStreetNumberValid = validateStreetNumber();
        const isImageUploadValid = validateImageUpload();
        const isAreaSizeValid = validateAreaSize();
        const isYearBuiltValid = validateYearBuilt();
        const isRentPriceValid = validateRentPrice();
        const isDateAvailableValid = validateDateAvailable();

        const isFormValid = isCityValid &&
                            isApartmentNameValid &&
                            isStreetNameValid &&
                            isStreetNumberValid &&
                            isImageUploadValid &&
                            isAreaSizeValid &&
                            isYearBuiltValid &&
                            isRentPriceValid &&
                            isDateAvailableValid;

        if (!isFormValid) {
            console.log("Form validation failed.");
            return;
        }

        try {
            const file = imageUploadInput.files[0];
            const imageBase64 = await convertImageToBase64(file);

            const city = cityInput.value.trim();
            const apartmentName = apartmentNameInput.value.trim();
            const streetName = streetNameInput.value.trim();
            const streetNumber = streetNumberInput.value.trim();
            const areaSize = Number(areaSizeInput.value.trim());
            const hasAc = hasAcInput.checked;
            const yearBuilt = Number(yearBuiltInput.value.trim());
            const rentPrice = Number(rentPriceInput.value.trim());
            const dateAvailable = dateAvailableInput.value;

            const newApartment = new Apartment(
                city,
                apartmentName,
                streetName,
                streetNumber,
                imageBase64,
                areaSize,
                hasAc,
                yearBuilt,
                rentPrice,
                dateAvailable
            );

            let allApartments = JSON.parse(localStorage.getItem("allApartments"));

            if (!Array.isArray(allApartments)) {
                allApartments = [];
            }
            allApartments.push(newApartment);
            localStorage.setItem("allApartments", JSON.stringify(allApartments));
            apartmentForm.reset();
            alert("Apartment has been successfully added!");
        } catch (error) {
            console.error("Error adding new apartment:", error);
            alert("An error occurred while adding the apartment. Please try again.");
        }
    });

    // Adding blur event listeners for individual validations
    cityInput.addEventListener("blur", validateCity);
    apartmentNameInput.addEventListener("blur", validateApartmentName);
    streetNameInput.addEventListener("blur", validateStreetName);
    streetNumberInput.addEventListener("blur", validateStreetNumber);
    imageUploadInput.addEventListener("change", validateImageUpload);
    areaSizeInput.addEventListener("blur", validateAreaSize);
    yearBuiltInput.addEventListener("blur", validateYearBuilt);
    rentPriceInput.addEventListener("blur", validateRentPrice);
    dateAvailableInput.addEventListener("blur", validateDateAvailable);
});
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
