(function() {
  // Function to get cookie value by name
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  // Function to redirect user
  function redirectTo(path) {
    if (window.location.origin.includes('server.wized.com')) {
      // We're in Wized preview - use Wized's navigation
      window.Wized = window.Wized || [];
      window.Wized.push((Wized) => {
        Wized.data.n.path = path;
      });
    } else {
      // Normal redirect
      window.location.href = path;
    }
  }

  // Check authentication and onboarding status
  const authToken = getCookie('auth_token');
  
  if (!authToken) {
    // No auth token - redirect to login
    redirectTo('/auth/log-in');
  } else {
    // Auth token exists - check onboarding status
    const onboardedStatus = localStorage.getItem('onboarded');
    
    if (onboardedStatus === 'true') {
      // User is authenticated and onboarded - redirect to dashboard
      redirectTo('/dashboard/');
    } else {
    }
  }
})();
