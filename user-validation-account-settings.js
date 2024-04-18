// Immediately executed function to manage user details and visibility
(function() {
    // Function to check for authToken cookie
    function checkAuthToken() {
        return document.cookie.split(";").some(item => item.trim().startsWith("authToken="));
    }

    const authTokenExists = checkAuthToken();
    const baseUrl = window.location.origin; // Dynamically get the base URL

    // Function to clear specific local storage items
    function clearLocalStorage() {
        localStorage.removeItem("full_name");
        localStorage.removeItem("onboarded");
        localStorage.removeItem("profile_image");
    }

    if (!authTokenExists) {
        clearLocalStorage();
        // Redirect to login page using the base URL from window.location.origin
        window.location.href = `${baseUrl}/auth/log-in`;
        return; // Prevent further execution
    }

    // Check if 'onboarded' key is 'false' in local storage
    const onboardedStatus = localStorage.getItem("onboarded") === "true";
    if (!onboardedStatus) {
        // Redirect to the onboarding page
        window.location.href = `${baseUrl}/onboarding`;
        return; // Prevent further execution after redirection
    }

    // If authToken exists, proceed to update user details
    function updateUserDetails() {
        let fullName;
        try {
            fullName = JSON.parse(localStorage.getItem("full_name"));
        } catch (e) {
            fullName = localStorage.getItem("full_name"); // Use as plain string if not JSON
        }

        let profileImageURL;
        try {
            profileImageURL = JSON.parse(localStorage.getItem("profile_image"));
        } catch (e) {
            profileImageURL = localStorage.getItem("profile_image"); // Use as plain string if not JSON
        }

        // Wait for DOM to be ready to manipulate elements
        document.addEventListener("DOMContentLoaded", function() {
            const userNameElements = document.querySelectorAll('[wized="navUserName"]');
            const userImageElement = document.querySelector('[wized="navUserImage"]');

            userNameElements.forEach(userNameElement => {
                if (fullName) {
                    userNameElement.textContent = fullName;
                    userNameElement.removeAttribute("custom-cloak"); // Reveal the element
                }
            });

            if (userImageElement) {
                if (profileImageURL && profileImageURL !== "null") {
                    userImageElement.src = profileImageURL;
                    userImageElement.removeAttribute("custom-cloak"); // Reveal the element
                } else {
                    userImageElement.remove();
                }
            }
        });
    }

    updateUserDetails();

    // Early visibility management before DOMContentLoaded
    document.addEventListener("DOMContentLoaded", function() {
        const accountSettingsElements = document.querySelectorAll('[custom-visibility="account-settings"]');
        
        document.querySelectorAll('[custom-visibility="authenticated"]').forEach(element => {
            element.removeAttribute("custom-cloak");
        });

        document.querySelectorAll('[custom-visibility="unauthenticated"]').forEach(element => {
            element.remove();
        });

        accountSettingsElements.forEach(element => {
            if (authTokenExists && onboardedStatus) {
                element.removeAttribute("custom-cloak");
            }
            // Leave as is if authToken exists but onboarded is false
        });
    });
})();
