// Immediately executed function to check authToken and manage redirection
(function() {
    // Function to check for authToken cookie
    function checkAuthToken() {
        return document.cookie.split(';').some((item) => item.trim().startsWith('auth_token='));
    }

    // Function to redirect to a specific path
    function redirectTo(path) {
        window.location.href = window.location.origin + path;
    }

    // Function to clear specific localStorage keys
    function clearLocalStorageKeys() {
        localStorage.removeItem("profile_image");
        localStorage.removeItem("full_name");
        localStorage.removeItem("onboarded");
    }

    // Execute logic based on authToken presence
    const authTokenExists = checkAuthToken();
    if (!authTokenExists) {
        clearLocalStorageKeys();
        redirectTo("/auth/log-in");
    } else {
        // Check the onboarded status from localStorage
        const onboarded = localStorage.getItem("onboarded");
        if (onboarded === "true") {
            redirectTo("/courses");
        }
        // If onboarded is false or not set, no further action is needed.
    }
})();
