// Immediately executed function to check authToken and manage user details and visibility
(function() {
    // Function to check for authToken cookie
    function checkAuthToken() {
        return document.cookie.split(";").some(item => item.trim().startsWith("auth_token="));
    }

    const authTokenExists = checkAuthToken();

    // Function to clear specific local storage items
    function clearLocalStorageItems() {
        localStorage.removeItem("full_name");
        localStorage.removeItem("onboarded");
        localStorage.removeItem("profile_image");
    }

    if (!authTokenExists) {
        clearLocalStorageItems(); // Clear local storage when authToken is not found
    }

    function updateUserDetails(authTokenExists) {
        // Attempt to retrieve and parse the full name, use direct value if not JSON
        let fullName;
        try {
            fullName = JSON.parse(localStorage.getItem("full_name"));
        } catch (e) {
            fullName = localStorage.getItem("full_name"); // Use as plain string if not JSON
        }
        
        // Attempt to retrieve and parse the profile image URL, use direct value if not JSON
        let profileImageURL;
        try {
            profileImageURL = JSON.parse(localStorage.getItem("profile_image"));
        } catch (e) {
            profileImageURL = localStorage.getItem("profile_image"); // Use as plain string if not JSON
        }

        // Wait for DOM to be ready to manipulate elements
        document.addEventListener("DOMContentLoaded", function () {
            const userNameElements = document.querySelectorAll('[wized="nav_userName"]');
            const userImageElement = document.querySelector('[wized="nav_userImage"]');

            if (authTokenExists) {
                // Update all userNameElements with full name
                userNameElements.forEach(userNameElement => {
                    if (fullName) {
                        userNameElement.textContent = fullName;
                        userNameElement.removeAttribute("custom-cloak"); // Reveal the element
                    }
                });

                // Update user image with profile image URL
                if (userImageElement) {
                    if (profileImageURL && profileImageURL !== "null") {
                        userImageElement.src = profileImageURL;
                        userImageElement.removeAttribute("custom-cloak"); // Reveal the element
                    } else {
                        userImageElement.remove();
                    }
                }
            }
        });
    }

    updateUserDetails(authTokenExists);

    // Early visibility management before DOMContentLoaded
    document.addEventListener("DOMContentLoaded", function () {
        const isOnboarded = localStorage.getItem('onboarded') === 'true';
        document.querySelectorAll('[custom-visibility="authenticated"]').forEach(element => {
            if (authTokenExists) {
                element.removeAttribute("custom-cloak");
            }
        });

        document.querySelectorAll('[custom-visibility="unauthenticated"]').forEach(element => {
            if (!authTokenExists) {
                element.removeAttribute("custom-cloak");
            } else {
                element.remove();
            }
        });

        // Handling custom-visibility for "account-settings"
        document.querySelectorAll('[custom-visibility="account-settings"]').forEach(element => {
            if (authTokenExists && isOnboarded) {
                element.removeAttribute("custom-cloak");
            }
            // Leave as is if authToken exists but onboarded is false
        });
    });
})();
