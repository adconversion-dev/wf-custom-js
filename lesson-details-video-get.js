(function () {
  // - Helper -

  // Get auth token
  function getAuthToken() {
    // Values
    const cookies = document.cookie.split(';');

    // Loop
    for (let i = 0; i < cookies.length; i++) {
      // Logic
      const cookie = cookies[i].trim();
      if (cookie.startsWith('auth_token=')) {
        return cookie.substring('auth_token='.length, cookie.length);
      }
    }

    // Return null if "auth_token" cookie is not found
    return null;
  }

  // Function to extract course_slug and lesson_id from URL
  function getCourseAndLesson() {
    // Values
    let url = new URL(window.location.href);

    // Overwrite url
    if (url.host == 'server.wized.com')
      url = new URL(url.searchParams.get('url'));

    // Values
    const lessonIdentifier = url.hash
      ? url.hash.substring(1)
      : url.searchParams.get('lesson_identifier');
    const parts = lessonIdentifier.split(url.hash ? '+' : ' ');

    // Return
    return {
      courseSlug: parts[0],
      lessonId: parts[1],
    };
  }

  // - Values -
  const authToken = getAuthToken();
  const { courseSlug, lessonId } = getCourseAndLesson();
  const apiUrl = `https://www.adconversion-dev.com/api:JJmw0c4k/course/lesson/details/video?course_slug=${encodeURIComponent(
    courseSlug
  )}&lesson_id=${encodeURIComponent(lessonId)}`;

  // - Main functions -

  // Fetch function
  async function fetchData() {
    try {
      // Await
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // Response
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Values
      const data = await response.json();

      // Trigger
      document.readyState == 'loading'
        ? document.addEventListener('DOMContentLoaded', () => {
            renderVideo(data);
          })
        : renderVideo(data);
      renderVideo(data);
    } catch (error) {
			// Redirect
			

      // Log error
      console.error('lessonVideoLoader.js | Error fetching data:', error);
    }
  }

  // Init the fetch function
  fetchData();

  // Render video
  function renderVideo(data) {
    // Elements
    const videoPlayer = document.getElementById('vimeo-player');
    const loaderElement = document.querySelector(
      '[wized="lesson_loader_video"]'
    );

    // Video
    const videoUrl = data.url;
    videoPlayer.src = videoUrl;

    // Vimeo api
    const player = new Vimeo.Player(videoPlayer);
    player.on('loaded', () => {
			// Reoving class
      loaderElement.classList.add('is-hidden');

			// Logic - if progress data exists & progress not 100, set starting time
      if (data.progress.length && data.progress[0].progress != 100) player.setCurrentTime(data.progress[0].watched_till / 1000);

			// Autoplay
			if (localStorage.getItem("autoplay") == "true") player.play();
    });
  }
})();
