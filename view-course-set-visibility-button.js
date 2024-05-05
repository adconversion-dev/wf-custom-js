(function() {
  const courseDetails = JSON.parse(localStorage.getItem('course_details'));

  // Define base URL and adjust if running inside Wized
  let baseUrl = window.location.origin;
  if (baseUrl.includes('server.wized.com')) {
      baseUrl = '/v2/page/proxy?url=https://adconversion-academy-wized.webflow.io';
  }

  // Fetch all course UUID elements
  const uuidElements = document.querySelectorAll('[wized="courses_uuid"]');

  uuidElements.forEach(element => {
    const courseUUID = element.textContent.trim();
    const courseCard = element.closest('.course-listing_item');
    const viewCourse1 = courseCard.querySelector('[wized="courses_viewCourse_trigger_1"]');
    const viewCourse2 = courseCard.querySelector('[wized="courses_viewCourse_trigger_2"]');
    const viewCourse3 = courseCard.querySelector('[wized="courses_viewCourse_trigger_3"]');
    const progressElement2 = viewCourse2.querySelector('[wized="courses_progress"]');
    const progressElement3 = viewCourse3.querySelector('[wized="courses_progress"]');

    // Find matching course detail
    const matchingCourse = courseDetails && courseDetails.find(course => course.uuid === courseUUID);

    if (matchingCourse) {
      const courseHref = `${baseUrl}/course/${matchingCourse.webflow_cms_slug}`;

      if (matchingCourse.progress === "100%") {
        viewCourse3.classList.remove('hidden');
        viewCourse3.href = courseHref;
        if (progressElement3) {
          progressElement3.textContent = `Current Progress - ${matchingCourse.progress} (Completed)`;
        }
      } else {
        viewCourse2.classList.remove('hidden');
        viewCourse2.href = courseHref;
        if (progressElement2) {
          progressElement2.textContent = `Current Progress - ${matchingCourse.progress}`;
        }
      }

      // Hide viewCourse1 if either viewCourse2 or viewCourse3 is visible
      if (!viewCourse2.classList.contains('hidden') || !viewCourse3.classList.contains('hidden')) {
        viewCourse1.classList.add('hidden');
      }
    } else {
      // If no matching course detail found, show the default view course button
      viewCourse1.classList.remove('hidden');
      viewCourse2.classList.add('hidden');
      viewCourse3.classList.add('hidden');
    }
  });
})();
