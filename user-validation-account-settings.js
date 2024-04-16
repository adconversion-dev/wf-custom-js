// Immediately executed function to manage user details and visibility
(function() {
    // Function to check for authToken cookie
    function checkAuthToken() {
        return document.cookie.split(";").some(item => item.trim().startsWith("authToken="));
    }

    const authTokenExists = checkAuthToken();
    const baseUrl = window.location.origin; // Dynamically get the base URL

    if (!authTokenExists) {
        // Clear specific local storage items
        localStorage.removeItem("full_name");
        localStorage.removeItem("onboarded");
        localStorage.removeItem("profile_image");

        // Redirect to login page using the base URL from window.location.origin
        window.location.href = `${baseUrl}/auth/log-in`;
        return; // Prevent further execution
    }

    // If authToken exists, proceed to update user details
    function updateUserDetails() {
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
            const userNameElements = document.querySelectorAll('[wized="navUserName"]');
            const userImageElement = document.querySelector('[wized="navUserImage"]');

            // Update all userNameElements with full name
            userNameElements.forEach(userNameElement => {
                if (fullName) {
                    userNameElement.textContent = fullName;
                    userNameElement.removeAttribute("custom-cloak"); // Reveal the element
                }
            });

            // Update user image with profile image URL
            if (userImageElement && profileImageURL && profileImageURL !== "null") {
                userImageElement.src = profileImageURL;
                userImageElement.removeAttribute("custom-cloak"); // Reveal the element
            } else if (userImageElement) {
                userImageElement.remove();
            }
        });
    }

    updateUserDetails();

    // Early visibility management before DOMContentLoaded
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll('[custom-visibility="authenticated"]').forEach(element => {
            element.removeAttribute("custom-cloak");
        });

        document.querySelectorAll('[custom-visibility="unauthenticated"]').forEach(element => {
            element.remove();
        });
    });
})();
