// Listen for the DOMContentLoaded event to ensure the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Select all elements with the attribute fs-socialshare-element="url"
    const urlShareElements = document.querySelectorAll('[fs-socialshare-element="url"]');

    // Get the current URL from the address bar
    const currentUrl = window.location.href;

    // Update all targeted elements with the current URL
    urlShareElements.forEach(element => {
        element.textContent = currentUrl; // Set the text content to the current URL
    });
});
