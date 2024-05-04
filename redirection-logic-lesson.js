(function() {
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

  const isWized = window.location.origin.includes('server.wized.com');

  function redirectTo(path) {
    if (isWized) {
      // Wized-specific redirection with simulated click
      function tryRedirect() {
        if (typeof Wized !== 'undefined' && Wized.data && Wized.data.n && 'path' in Wized.data.n) {
          const fullUrl = `/v2/page/proxy?url=https://adconversion-academy-wized.webflow.io${path}`;
          console.log("Redirecting within Wized to:", fullUrl);
          
          var link = document.createElement('a');
          link.href = fullUrl;
          link.style.display = 'none'; // Hide the link
          document.body.appendChild(link); // Add to the document
          link.click(); // Simulate a click
          document.body.removeChild(link); // Remove the link from the document
        } else {
          console.log("Wized or necessary properties are still not defined, retrying...");
          setTimeout(tryRedirect, 100);
        }
      }
      tryRedirect();
    } else {
      // Standard redirection outside of Wized
      window.location.href = path;
    }
  }

  function checkReadiness() {
    if (typeof Wized !== 'undefined' && Wized.data && Wized.data.n) {
      const proxyUrl = new URL(window.location.href);
      const realUrl = proxyUrl.searchParams.get('url');
      const urlToCheck = realUrl ? new URL(realUrl) : proxyUrl;
      const searchParams = urlToCheck.searchParams;
      const hasValidNavigationIndicator = searchParams.has('lesson_identifier');

      console.log("Current URL:", urlToCheck.href);
      console.log("Search params:", Array.from(searchParams.entries()));
      console.log("Checking navigation indicator:", hasValidNavigationIndicator);

      const authToken = getCookie('auth_token');
      const onboarded = localStorage.getItem('onboarded') === 'true';

      if (!authToken) {
        redirectTo("/auth/log-in");
      } else if (authToken && !hasValidNavigationIndicator) {
        console.log("Redirecting due to missing navigation indicator");
        redirectTo("/courses");
      } else if (authToken && onboarded === false) {
        redirectTo("/onboarding");
      } else if (authToken && onboarded === true) {
        console.log("User is authenticated and onboarded.");
      }
    } else {
      console.log("Waiting for Wized to be fully ready...");
      setTimeout(checkReadiness, 100);
    }
  }

  if (isWized) {
    checkReadiness();
  } else {
    const authToken = getCookie('auth_token');
    const onboarded = localStorage.getItem('onboarded') === 'true';
    const currentUrl = window.location.href;
    const hasHash = currentUrl.includes('#');

    if (!authToken) {
      redirectTo("/auth/log-in");
    } else if (authToken && !hasHash) {
      redirectTo("/courses");
    } else if (authToken && onboarded === false) {
      redirectTo("/onboarding");
    } else if (authToken && onboarded === true) {
      console.log("User is authenticated and onboarded.");
    }
  }
})();
