// Immediately executed function to manage user state and redirection
(function() {
  function checkAuthToken() {
    return document.cookie.split(";").some(item => item.trim().startsWith("authToken="));
  }

  const authTokenExists = checkAuthToken();
  const baseUrl = window.location.origin;

  if (!authTokenExists) {
    localStorage.clear(); // Consider clearing all at once if appropriate
    window.location.href = `${baseUrl}/auth/log-in`;
    return;
  }

  const isOnboarded = localStorage.getItem("onboarded") === "true";
  if (!isOnboarded) {
    window.location.href = `${baseUrl}/onboarding`;
    return;
  }

  if (!window.location.hash) {
    window.location.href = `${baseUrl}/courses`;
    return;
  }

  function updateUIElements() {
    const userNameElements = document.querySelectorAll('[wized="navUserName"]');
    const userImageElement = document.querySelector('[wized="navUserImage"]');
    const authenticatedElements = document.querySelectorAll('[custom-visibility="authenticated"]');

    let fullName;
    let profileImageURL;

    // Attempt to retrieve and parse the full name, use direct value if not JSON
    try {
        fullName = JSON.parse(localStorage.getItem("full_name"));
    } catch (e) {
        fullName = localStorage.getItem("full_name"); // Use as plain string if not JSON
    }
    
    // Attempt to retrieve and parse the profile image URL, use direct value if not JSON
    try {
        profileImageURL = JSON.parse(localStorage.getItem("profile_image"));
    } catch (e) {
        profileImageURL = localStorage.getItem("profile_image"); // Use as plain string if not JSON
    }

    // Update all userNameElements with full name
    userNameElements.forEach(userNameElement => {
        if (fullName) {
            userNameElement.textContent = fullName;
            userNameElement.removeAttribute("custom-cloak");
        }
    });

    // Update user image with profile image URL
    if (userImageElement && profileImageURL !== "null") {
        userImageElement.src = profileImageURL;
        userImageElement.removeAttribute("custom-cloak");
    }

    authenticatedElements.forEach(element => {
        element.removeAttribute("custom-cloak");
    });
  }

  // Try to update UI immediately, if elements aren't available, retry after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateUIElements);
  } else {
    updateUIElements(); // DOM is already ready
  }
})();
