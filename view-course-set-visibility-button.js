const courseDetails = JSON.parse(localStorage.getItem('course_details'));

if (!courseDetails) {
    document.querySelectorAll('[wized="courses_viewCourse_trigger_1"]').forEach(element => {
        element.classList.remove('hidden');
    });
} else {
    let baseUrl = window.location.origin;

    // Check if running inside Wized, then adjust the URL format.
    if (baseUrl.includes('server.wized.com')) {
        baseUrl = '/v2/page/proxy?url=https://adconversion-academy-wized.webflow.io';
    }

    courseDetails.forEach(course => {
        const uuidElements = document.querySelectorAll(`[wized="courses_uuid"]`);

        uuidElements.forEach(element => {
            if (element.textContent.trim() === course.uuid) {
                const courseCard = element.closest('.course-listing_item');
                const viewCourse1 = courseCard.querySelector('[wized="courses_viewCourse_trigger_1"]');
                const viewCourse2 = courseCard.querySelector('[wized="courses_viewCourse_trigger_2"]');
                const viewCourse3 = courseCard.querySelector('[wized="courses_viewCourse_trigger_3"]');
                const progressElement2 = viewCourse2.querySelector('[wized="courses_progress"]');
                const progressElement3 = viewCourse3.querySelector('[wized="courses_progress"]');

                // Define the correct href based on the environment
                const courseHref = `${baseUrl}/course/${course.webflow_cms_slug}`;

                if (course.progress === "100%") {
                    viewCourse3.classList.remove('hidden');
                    viewCourse3.href = courseHref;
                    if (progressElement3) {
                        progressElement3.textContent = `Current Progress - ${course.progress} (Completed)`;
                    }
                } else {
                    viewCourse2.classList.remove('hidden');
                    viewCourse2.href = courseHref;
                    if (progressElement2) {
                        progressElement2.textContent = `Current Progress - ${course.progress}`;
                    }
                }

                // Hide viewCourse1 if either viewCourse2 or viewCourse3 is visible
                if (!viewCourse2.classList.contains('hidden') || !viewCourse3.classList.contains('hidden')) {
                    viewCourse1.classList.add('hidden');
                }
            }
        });
    });
}
