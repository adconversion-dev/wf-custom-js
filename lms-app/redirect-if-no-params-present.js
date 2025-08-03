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

  // Check for course_id and lesson_id parameters
  if (window.location.origin.includes('server.wized.com')) {
    // In Wized preview - wait for Wized to be ready
    window.Wized = window.Wized || [];
    window.Wized.push((Wized) => {
      const courseId = Wized.data.n.parameter.course_id;
      const lessonId = Wized.data.n.parameter.lesson_id;
      
      if (!courseId || !lessonId) {
        // Missing course_id or lesson_id parameter - redirect to all courses
        redirectTo('/learn/courses/all-courses');
      }
      // If both course_id and lesson_id exist, allow access to current page
    });
  } else {
    // Normal environment - check URL parameters directly
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('course_id');
    const lessonId = urlParams.get('lesson_id');
    
    if (!courseId || !lessonId) {
      // Missing course_id or lesson_id parameter - redirect to all courses
      redirectTo('/learn/courses/all-courses');
    }
    // If both course_id and lesson_id exist, allow access to current page
  }
})();
