// Immediately executed function to manage user state and redirection
(function() {
  function checkAuthToken() {
    return document.cookie.split(";").some(item => item.trim().startsWith("auth_token="));
  }

  const authTokenExists = checkAuthToken();
  const baseUrl = window.location.origin;

  // Function to clear specific local storage items
  function clearSpecificLocalStorageItems() {
    localStorage.removeItem("full_name");
    localStorage.removeItem("onboarded");
    localStorage.removeItem("profile_image");
  }

  if (!authTokenExists) {
    clearSpecificLocalStorageItems(); // Clear specific local storage items
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
    const userNameElements = document.querySelectorAll('[wized="nav_userName"]');
    const userImageElement = document.querySelector('[wized="nav_userImage"]');
    const authenticatedElements = document.querySelectorAll('[custom-visibility="authenticated"]');
    const accountSettingsElements = document.querySelectorAll('[custom-visibility="account-settings"]');

    // Function to safely parse JSON or return the original value
    function safeJSONParse(value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value; // Return the plain string if JSON parse fails
      }
    }

    let fullName = safeJSONParse(localStorage.getItem("full_name"));
    let profileImageURL = safeJSONParse(localStorage.getItem("profile_image"));

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

    // Update authenticated and account settings visibility
    authenticatedElements.forEach(element => {
      element.removeAttribute("custom-cloak");
    });

    accountSettingsElements.forEach(element => {
      if (authTokenExists && isOnboarded) {
        element.removeAttribute("custom-cloak");
      }
      // Leave as is if authToken exists but onboarded is false
    });
  }

  // Try to update UI immediately, if elements aren't available, retry after DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateUIElements);
  } else {
    updateUIElements(); // DOM is already ready
  }
})();
