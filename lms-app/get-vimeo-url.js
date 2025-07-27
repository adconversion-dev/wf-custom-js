(function () {
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  function isWizedEnvironment() {
    return window.location.origin.includes("server.wized.com");
  }

  function isDevEnvironment() {
    return (
      window.location.origin.includes("webflow.io") ||
      window.location.origin.includes("server.wized.com")
    );
  }

  function extractParamsFromWizedUrl() {
    // Get the embedded URL from the 'url' parameter
    const embeddedUrl = getUrlParam("url");
    if (!embeddedUrl) return { courseId: null, lessonId: null };

    try {
      // Decode the URL
      const decodedUrl = decodeURIComponent(embeddedUrl);
      // Create a URL object to parse parameters
      const urlObj = new URL(decodedUrl);
      const courseId = urlObj.searchParams.get("course_id");
      const lessonId = urlObj.searchParams.get("lesson_id");

      return { courseId, lessonId };
    } catch (error) {
      console.error("Error parsing embedded URL:", error);
      return { courseId: null, lessonId: null };
    }
  }

  function getParameterValues() {
    if (isWizedEnvironment()) {
      // In Wized environment, extract from the embedded URL first
      const urlParams = extractParamsFromWizedUrl();
      if (urlParams.courseId && urlParams.lessonId) {
        return Promise.resolve(urlParams);
      }

      // Fallback to Wized API if URL extraction fails
      return new Promise((resolve) => {
        window.Wized = window.Wized || [];
        window.Wized.push((Wized) => {
          const courseId = Wized.data.n.parameter.course_id;
          const lessonId = Wized.data.n.parameter.lesson_id;
          resolve({ courseId, lessonId });
        });
      });
    } else {
      // Use URL parameters
      const courseId = getUrlParam("course_id");
      const lessonId = getUrlParam("lesson_id");
      return Promise.resolve({ courseId, lessonId });
    }
  }

  function getAutoplayPreference() {
    const stored = localStorage.getItem("autoplay");
    return stored === "true";
  }

  function initializeVimeoPlayer(
    videoElement,
    shouldAutoplay,
    watchedTillMs,
    isCompleted = false
  ) {
    // Wait a bit for the iframe to be fully loaded
    setTimeout(() => {
      try {
        if (window.Vimeo && window.Vimeo.Player) {
          const player = new Vimeo.Player(videoElement);

          // Wait for player to be ready before setting time
          player
            .ready()
            .then(() => {
              // Only set the current time if we have a watched_till value AND the lesson is not completed
              if (watchedTillMs && watchedTillMs > 0 && !isCompleted) {
                const watchedTillSeconds = watchedTillMs / 1000;
                player
                  .setCurrentTime(watchedTillSeconds)
                  .then(() => {

                    // Start autoplay after setting the time
                    if (shouldAutoplay) {
                      player
                        .play()
                        .then(() => {
                        })
                        .catch((error) => {
                        });
                    }
                  })
                  .catch((error) => {
                    console.error("Error setting video time:", error);

                    // Try autoplay anyway if it was requested
                    if (shouldAutoplay) {
                      player
                        .play()
                        .then(() => {
                        })
                        .catch((error) => {
                        });
                    }
                  });
              } else {
                // No saved progress, lesson completed, or starting from beginning
                if (isCompleted) {
                }

                if (shouldAutoplay) {
                  player
                    .play()
                    .then(() => {
                    })
                    .catch((error) => {
                    });
                }
              }
            })
            .catch((error) => {
              console.error("Error waiting for player ready:", error);
            });
        } else {
          console.error("Vimeo Player API not available");
        }
      } catch (error) {
        console.error("Error initializing Vimeo player:", error);
      }
    }, 1500); // Increased wait time to 1.5 seconds for better reliability
  }

  function updateVideoWithProgress(
    videoElement,
    videoUrl,
    watchedTillMs,
    isCompleted = false
  ) {
    const shouldAutoplay = getAutoplayPreference();

    // Set the video URL without timestamp (we'll use API to set time)
    videoElement.setAttribute("src", videoUrl);
    if (watchedTillMs && watchedTillMs > 0 && !isCompleted) {
    } else if (isCompleted) {
    }

    // Initialize Vimeo player with progress restoration
    initializeVimeoPlayer(
      videoElement,
      shouldAutoplay,
      watchedTillMs,
      isCompleted
    );
  }

  async function fetchAndUpdateVideoUrl() {
    try {
      const authToken = getCookie("auth_token");
      if (!authToken) {
        console.error("Auth token not found in cookies");
        return;
      }

      const { courseId, lessonId } = await getParameterValues();

      if (!courseId || !lessonId) {
        console.error("Missing course_id or lesson_id in parameters");
        return;
      }

      // Determine API URL based on environment
      const baseUrl = isDevEnvironment()
        ? "https://www.adconversion-dev.com/api:diDJsTkB:staging/learn/courses/lesson/get-video-url"
        : "https://www.adconversion-dev.com/api:diDJsTkB/learn/courses/lesson/get-video-url";

      const apiUrl = `${baseUrl}?course_id=${courseId}&lesson_id=${lessonId}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
          "X-Data-Source": isDevEnvironment() ? "staging" : "production",
        },
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.url) {
        console.error("URL not found in API response");
        return;
      }

      const videoElement = document.querySelector(
        '[wized="learn_courses_lesson_vimeo"]'
      );
      if (videoElement) {
        // Extract progress data from the first entry
        let watchedTillMs = null;
        let isCompleted = false;

        if (
          data.progress &&
          Array.isArray(data.progress) &&
          data.progress.length > 0
        ) {
          const progressData = data.progress[0];
          watchedTillMs = progressData.watched_till;
          isCompleted = progressData.progress === 100;
        }

        updateVideoWithProgress(
          videoElement,
          data.url,
          watchedTillMs,
          isCompleted
        );
      } else {
        console.error("Video element not found");
      }
    } catch (error) {
      console.error("Error fetching or updating video URL:", error);
    }
  }

  // Execute based on environment
  if (isWizedEnvironment()) {
    // In Wized environment, wait for Wized to be ready
    window.Wized = window.Wized || [];
    window.Wized.push((Wized) => {
      fetchAndUpdateVideoUrl();
    });
  } else {
    // In regular environment, wait for DOM
    document.addEventListener("DOMContentLoaded", fetchAndUpdateVideoUrl);
  }
})();
