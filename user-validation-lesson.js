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

    // Try parsing full name and profile image URL, revert to direct use if not JSON
    let fullName = localStorage.getItem("full_name");
    let profileImageURL = localStorage.getItem("profile_image");
    
    try {
        fullName = JSON.parse(fullName) || fullName; // Use parsed value or original if parsing fails
    } catch (e) {
        // Use original if parsing throws an error
    }
    
    try {
        profileImageURL = JSON.parse(profileImageURL) || profileImageURL; // Use parsed value or original if parsing fails
    } catch (e) {
        // Use original if parsing throws an error
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
