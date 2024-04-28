const courseDetails = JSON.parse(localStorage.getItem('course_details'));
const urlSlug = window.location.pathname.split('/').pop(); // Assuming the slug is the last segment of the URL

if (!courseDetails) {
    // No course details found, show the elements for users not enrolled in any course
    document.querySelectorAll('[wized="course_enrolled_false"]').forEach(element => {
        element.classList.remove('hidden');
    });
} else {
    let matchFound = false;

    // Check each course in the course details for a matching slug
    for (const course of courseDetails) {
        if (course.webflow_cms_slug === urlSlug) {
            matchFound = true;

            // Match found, handle visibility and updates based on progress
            const progress = parseInt(course.progress.replace('%', ''), 10); // Remove '%' and convert to integer
            const triggers2 = document.querySelectorAll('[wized="course_startLesson_trigger_2"]');
            const triggers3 = document.querySelectorAll('[wized="course_startLesson_trigger_3"]');

            if (progress < 100) {
                triggers2.forEach(trigger2 => {
                    trigger2.classList.remove('hidden');
                    trigger2.href = `${window.location.origin}/lesson#${course.slug}+${course.last_played_lesson_id}`;
                    const progressElement = trigger2.querySelector('[wized="courses_progress"]');
                    if (progressElement) {
                        progressElement.textContent = `Current Progress - ${course.progress}`;
                    }
                });
            } else {
                triggers3.forEach(trigger3 => {
                    trigger3.classList.remove('hidden');
                    trigger3.href = `${window.location.origin}/lesson#${course.slug}${course.last_played_lesson_id}`;
                    const progressElement = trigger3.querySelector('[wized="courses_progress"]');
                    if (progressElement) {
                        progressElement.textContent = `Current Progress - ${course.progress} (Completed)`;
                    }
                });
            }

            // Display last viewed info
            document.querySelectorAll('[wized="course_startLesson_lastPlayed"]').forEach(elem => {
                elem.textContent = `Last Viewed - ${course.module_and_lesson_number}`;
            });

            // Show all course enrolled true elements
            document.querySelectorAll('[wized="course_enrolled_true"]').forEach(element => {
                element.classList.remove('hidden');
            });

            break; // Stop checking after a match is found
        }
    }

    // If no match found, show the elements for users not enrolled in the course
    if (!matchFound) {
        document.querySelectorAll('[wized="course_enrolled_false"]').forEach(element => {
            element.classList.remove('hidden');
        });
    }
}
