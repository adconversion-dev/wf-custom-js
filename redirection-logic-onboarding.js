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

  // Redirect based on the presence of 'auth_token' and the value of 'onboarded'
  if (authToken) {
    if (isOnboarded) {
      window.location.href = "/courses";
    }
    // If onboarded is false, do nothing and let the user proceed
  } else {
    // If 'auth_token' is not present, redirect to log-in page
    window.location.href = "/auth/log-in";
  }
})();
