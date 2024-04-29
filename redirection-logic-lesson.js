(function() {
  // Helper function to get cookie by name
  function getCookie(name) {
    let cookieArray = document.cookie.split(';');
    for(let i = 0; i < cookieArray.length; i++) {
      let cookiePair = cookieArray[i].split('=');
      if(name == cookiePair[0].trim()) {
        return decodeURIComponent(cookiePair[1]);
      }
    }
    return null;
  }

  // Check for 'auth_token' in the cookies
  const authToken = getCookie('auth_token');

  // Get 'onboarded' status from local storage
  const onboarded = localStorage.getItem('onboarded') === 'true';

  // Get the current URL and check for hash
  const currentUrl = window.location.href;
  const hasHash = currentUrl.includes('#');

  if (!authToken) {
    // If 'auth_token' does not exist, redirect to log-in page
    window.location.href = "/auth/log-in";
  } else if (authToken && !hasHash) {
    // If 'auth_token' exists but URL has no hash, redirect to "/courses"
    window.location.href = "/courses";
  } else if (authToken && onboarded === false) {
    // If 'auth_token' exists and 'onboarded' is false, redirect to onboarding
    window.location.href = "/onboarding";
  } else if (authToken && onboarded === true) {
    // If 'auth_token' exists and 'onboarded' is true, let the user stay on the page
    console.log("User is authenticated and onboarded.");
  }
})();
