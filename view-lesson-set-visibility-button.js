const courseDetails = JSON.parse(localStorage.getItem('course_details'));

function waitForWizedPath(callback) {
    if (typeof Wized !== 'undefined' && Wized.data && Wized.data.n && Wized.data.n.path) {
        console.log("Wized path:", Wized.data.n.path);
        callback(Wized.data.n.path);
    } else {
        console.log("Wized not defined yet, retrying...");
        setTimeout(() => waitForWizedPath(callback), 100);
    }
}

function checkCourseEnrollment(currentPath) {
    const urlSlug = currentPath.split('/').pop();
    console.log("URL Slug derived:", urlSlug);

    if (!courseDetails || courseDetails.length === 0) {
        console.log("No course details found or empty array.");
        document.querySelectorAll('[wized="course_enrolled_false"]').forEach(element => element.classList.remove('hidden'));
        document.querySelectorAll('[wized="course_enrolled_true"]').forEach(element => element.classList.add('hidden'));
    } else {
        let matchFound = false;

        for (const course of courseDetails) {
            console.log("Checking course:", course.webflow_cms_slug, "against slug:", urlSlug);
            if (course.webflow_cms_slug === urlSlug) {
                console.log("Match found:", course);
                matchFound = true;
                updateCourseVisibility(course, window.location.origin.includes('server.wized.com'));
                break;
            }
        }

        if (!matchFound) {
            console.log("No matching course found.");
            document.querySelectorAll('[wized="course_enrolled_false"]').forEach(element => element.classList.remove('hidden'));
            document.querySelectorAll('[wized="course_enrolled_true"]').forEach(element => element.classList.add('hidden'));
        }
    }
}

if (window.location.origin.includes('server.wized.com')) {
    waitForWizedPath(checkCourseEnrollment);
} else {
    checkCourseEnrollment(window.location.pathname);
}

function updateCourseVisibility(course, isWized) {
    document.querySelectorAll('[wized="course_enrolled_true"]').forEach(element => {
        console.log("Showing enrolled elements");
        element.classList.remove('hidden');
    });
    document.querySelectorAll('[wized="course_enrolled_false"]').forEach(element => {
        console.log("Hiding not enrolled elements");
        element.classList.add('hidden');
    });

    const progress = parseInt(course.progress.replace('%', ''), 10);
    const triggers = document.querySelectorAll(progress < 100 ? '[wized="course_startLesson_trigger_2"]' : '[wized="course_startLesson_trigger_3"]');
    
    triggers.forEach(trigger => {
        trigger.classList.remove('hidden');
        if (isWized) {
            trigger.href = `/v2/page/proxy?url=https://adconversion-academy-wized.webflow.io/lesson?lesson_identifier=${course.slug}+${course.last_played_lesson_id}`;
        } else {
            trigger.href = `${window.location.origin}/lesson#${course.slug}${progress === 100 ? course.last_played_lesson_id : '+' + course.last_played_lesson_id}`;
        }
        const progressElement = trigger.querySelector('[wized="courses_progress"]');
        if (progressElement) {
            progressElement.textContent = `Current Progress - ${course.progress}${progress === 100 ? ' (Completed)' : ''}`;
        }
    });

    document.querySelectorAll('[wized="course_startLesson_lastPlayed"]').forEach(elem => {
        elem.textContent = `Last Viewed - ${course.module_and_lesson_number}`;
    });
}
