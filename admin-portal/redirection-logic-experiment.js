(function () {
  // Function to get cookie value by name
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  // Function to redirect user
  function redirectTo(path) {
    if (window.location.origin.includes("server.wized.com")) {
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

  // First check admin authentication status
  const adminAuthToken = getCookie("admin_auth_token");

  if (!adminAuthToken) {
    // No admin auth token - clear all localStorage and redirect to admin login
    localStorage.clear();
    redirectTo("/auth/log-in");
    return; // Stop further execution
  }

  // Check for course_id parameter
  if (window.location.origin.includes("server.wized.com")) {
    // In Wized preview - wait for Wized to be ready
    window.Wized = window.Wized || [];
    window.Wized.push((Wized) => {
      const courseId = Wized.data.n.parameter.experiment_id;

      if (!courseId) {
        // Missing course_id parameter - redirect to all courses
        redirectTo("/dashboard/experiments/all-experiments");
      }
    });
  } else {
    // Normal environment - check URL parameters directly
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("experiment_id");

    if (!courseId) {
      // Missing course_id parameter - redirect to all courses
      redirectTo("/dashboard/experiments/all-experiments");
    }
  }
})();
