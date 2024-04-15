// Immediately executed function to manage user state and redirection
(function() {
  function checkAuthToken() {
    return document.cookie.split(";").some(item => item.trim().startsWith("authToken="));
  }

  const authTokenExists = checkAuthToken();
  const baseUrl = window.location.origin;

  if (!authTokenExists) {
    localStorage.clear();  // Consider clearing all at once if appropriate
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
    const userNameElement = document.querySelector('[wized="navUserName"]');
    const userImageElement = document.querySelector('[wized="navUserImage"]');
    const authenticatedElements = document.querySelectorAll('[custom-visibility="authenticated"]');

    if (userNameElement && localStorage.getItem("full_name")) {
      userNameElement.textContent = JSON.parse(localStorage.getItem("full_name"));
      userNameElement.removeAttribute("custom-cloak");
    }

    if (userImageElement && localStorage.getItem("profile_image") !== "null") {
      userImageElement.src = JSON.parse(localStorage.getItem("profile_image"));
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
    updateUIElements();  // DOM is already ready
  }
})();

