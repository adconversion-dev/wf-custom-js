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

  // Get URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get('course_id');
  const lessonId = urlParams.get('lesson_id');

  // Check if both required parameters are present
  if (!courseId || !lessonId) {
    // Missing one or both required parameters - redirect to all courses
    redirectTo('/learn/courses/all-courses');
  }
  // If both parameters exist, allow access to current page
})();
