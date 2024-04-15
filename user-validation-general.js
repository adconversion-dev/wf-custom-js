// Immediately executed function to check authToken and manage user details and visibility
(function() {
    // Function to check for authToken cookie
    function checkAuthToken() {
        return document.cookie.split(";").some(item => item.trim().startsWith("authToken="));
    }

    const authTokenExists = checkAuthToken();

    function updateUserDetails(authTokenExists) {
        const fullName = localStorage.getItem("full_name");
        const profileImageURL = localStorage.getItem("profile_image");

        // Wait for DOM to be ready to manipulate elements
        document.addEventListener("DOMContentLoaded", function () {
            const userNameElement = document.querySelectorAll('[wized="navUserName"]');
            const userImageElement = document.querySelector('[wized="navUserImage"]');

            if (authTokenExists) {
                if (userNameElement && fullName) {
                    userNameElement.textContent = JSON.parse(fullName);
                    userNameElement.removeAttribute("custom-cloak"); // Reveal the element
                }

                if (userImageElement) {
                    if (profileImageURL && profileImageURL !== "null") {
                        userImageElement.src = JSON.parse(profileImageURL);
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
    });
})();
