document.addEventListener('DOMContentLoaded', function() {
    // Target all elements with wized="logout" attribute
    var logoutElements = document.querySelectorAll('[wized="logout"]');

    // Define the base URL based on the environment
    let baseUrl = window.location.origin.includes('server.wized.com')
        ? '/v2/page/proxy?url=https://adconversion-academy-wized.webflow.io'
        : window.location.origin;

    // Iterate over each logout element and add a click event listener
    logoutElements.forEach(function(logoutElement) {
        logoutElement.addEventListener('click', function() {
            // Set authToken cookie to null
            document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

            // Clear specific keys from local storage
            localStorage.removeItem('full_name');
            localStorage.removeItem('onboarded');
            localStorage.removeItem('profile_image');
            localStorage.removeItem('course_details');

            // Redirect to the login page
            window.location.href = `${baseUrl}/auth/log-in`;
        });
    });
});
