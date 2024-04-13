// Immediately executed function to check authToken and manage redirections and visibility
(function() {
  // Function to check if the authToken cookie exists
  function checkAuthToken() {
    return document.cookie.split(";").some(item => item.trim().startsWith("authToken="));
  }

  const authTokenExists = checkAuthToken();
  const baseUrl = window.location.origin;

  // Redirect user based on the absence of authToken or the onboarding status
  if (!authTokenExists) {
    // Clear specific localStorage items
    localStorage.removeItem("authenticated");
    localStorage.removeItem("full_name");
    localStorage.removeItem("onboarded");

    // Redirect to login
    window.location.href = `${baseUrl}/auth/log-in`;
    return; // Exit the function to prevent further execution
  } else {
    const isOnboarded = localStorage.getItem("onboarded") === "true";
    if (!isOnboarded) {
      // Redirect to onboarding if not completed
      window.location.href = `${baseUrl}/onboarding`;
      return; // Exit the function to prevent further execution
    }
  }

  // Update user details and manage element visibility if user is authenticated and onboarded
  document.addEventListener("DOMContentLoaded", function () {
    const fullName = localStorage.getItem("full_name");
    const profileImageURL = localStorage.getItem("profile_image");

    const userNameElement = document.querySelector('[wized="navUserName"]');
    const userImageElement = document.querySelector('[wized="navUserImage"]');
    const authenticatedElements = document.querySelectorAll('[custom-visibility="authenticated"]');

    if (userNameElement && fullName) {
      userNameElement.textContent = JSON.parse(fullName);
      userNameElement.removeAttribute("custom-cloak");
    }

    if (userImageElement) {
      if (profileImageURL && profileImageURL !== "null") {
        userImageElement.src = JSON.parse(profileImageURL);
        userImageElement.removeAttribute("custom-cloak");
      }
    }

    // Remove 'custom-cloak' for authenticated elements
    authenticatedElements.forEach(element => {
      element.removeAttribute("custom-cloak");
    });
  });
})();
