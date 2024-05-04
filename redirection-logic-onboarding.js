(function() {
  // Function to check if a specific cookie exists and return its value
  function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  // Check for 'auth_token' in cookies
  const authToken = getCookie('auth_token');

  // Check for 'onboarded' in local storage
  const isOnboarded = localStorage.getItem('onboarded') === 'true';

  // Function to determine the base URL for redirection
  function getBaseUrl() {
    if (window.location.hostname.includes('server.wized.com')) {
      // Inside Wized, adjust to use the proxy format
      return "/v2/page/proxy?url=" + encodeURIComponent("https://adconversion-academy-wized.webflow.io");
    } else {
      // Outside Wized, use the normal site base URL
      return window.location.origin;
    }
  }

  // Redirect based on the presence of 'auth_token' and the value of 'onboarded'
  if (authToken) {
    if (isOnboarded) {
      window.location.href = getBaseUrl() + "/courses";
    }
    // If onboarded is false, do nothing and let the user proceed
  } else {
    // If 'auth_token' is not present, redirect to log-in page
    window.location.href = getBaseUrl() + "/auth/log-in";
  }
})();
