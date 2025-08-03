(function() {
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

  // Function to get course_id parameter
  function getCourseId() {
    if (window.location.origin.includes('server.wized.com')) {
      // We're in Wized preview - check Wized parameter
      if (window.Wized && window.Wized.data) {
        return window.Wized.data.n.parameter.course_id;
      }
      return null;
    } else {
      // Normal URL parameter check
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('course_id');
    }
  }

  // Check for course_id parameter
  if (window.location.origin.includes('server.wized.com')) {
    // In Wized preview - wait for Wized to be ready
    window.Wized = window.Wized || [];
    window.Wized.push((Wized) => {
      const courseId = Wized.data.n.parameter.course_id;
      
      if (!courseId) {
        // No course_id parameter - redirect to all courses
        redirectTo('/learn/courses/all-courses');
      }
      // If course_id exists, allow access to current page
    });
  } else {
    // Normal environment - check URL parameters directly
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('course_id');
    
    if (!courseId) {
      // No course_id parameter - redirect to all courses
      redirectTo('/learn/courses/all-courses');
    }
    // If course_id exists, allow access to current page
  }
})();
