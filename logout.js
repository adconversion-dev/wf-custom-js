document.addEventListener('DOMContentLoaded', function() {
    // Target the element with wized="logout" attribute
    var logoutElement = document.querySelector('[wized="logout"]');

    if (logoutElement) {
        logoutElement.addEventListener('click', function() {
            // Set authToken cookie to null
            document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

            // Clear specific keys from local storage
            localStorage.removeItem('full_name');
            localStorage.removeItem('onboarded');
            localStorage.removeItem('profile_image');

            // Redirect to the login page
            window.location.href = '/auth/log-in';
        });
    }
});
