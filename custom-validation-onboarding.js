document.addEventListener("DOMContentLoaded", function() {
    // Function to check for authToken cookie
    function checkAuthToken() {
        return document.cookie.split(';').some((item) => item.trim().startsWith('authToken='));
    }

    // Function to redirect to a specific path
    function redirectTo(path) {
        window.location.href = window.location.origin + path;
    }

    // Execute logic based on authToken presence
    const authTokenExists = checkAuthToken();
    if (!authTokenExists) {
        redirectTo("/auth/log-in");
    } else {
        // Check the onboarded status from localStorage
        const onboarded = localStorage.getItem("onboarded");
        if (onboarded === "true") {
            redirectTo("/course/b2b-advertising-foundations");
        }
        // If onboarded is false or not set, no further action is needed.
    }
});
