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

  // Check if we're in Wized environment
  if (window.location.origin.includes('server.wized.com') || typeof window.Wized !== 'undefined') {
    // We're in Wized - use Wized's parameter data
    window.Wized = window.Wized || [];
    window.Wized.push((Wized) => {
      const courseId = Wized.data.n.parameter.course_id;
      const lessonId = Wized.data.n.parameter.lesson_id;

      // Check if both required parameters are present
      if (!courseId || !lessonId) {
        // Missing one or both required parameters - redirect to all courses
        redirectTo('/learn/courses/all-courses');
      }
      // If both parameters exist, allow access to current page
    });
  } else {
    // Not in Wized - use native URLSearchParams
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('course_id');
    const lessonId = urlParams.get('lesson_id');

    // Check if both required parameters are present
    if (!courseId || !lessonId) {
      // Missing one or both required parameters - redirect to all courses
      redirectTo('/learn/courses/all-courses');
    }
  }
})();
