document.addEventListener('DOMContentLoaded', function () {
    window.Wized = window.Wized || [];
    window.Wized.push(async (Wized) => {
      // Listen for successful execution of "get_lesson_details"
      Wized.on('request', (result) => {
        if (result.name === 'get_lesson_details' && result.ok) {
          // Retrieve all elements with wized="courseLesson_chapterLink" using standard JavaScript
          const chapterLinks = document.querySelectorAll('[wized="courseLesson_chapterLink"]');
    
          chapterLinks.forEach((link) => {
            // Check if the 'completed' attribute is set to 'true'
            const isCompleted = link.getAttribute('completed') === 'true';
            const isActive = link.classList.contains('active');
            // Find the child elements for the play icon, completed mark, and alternative completed mark
            const playIcon = link.querySelector('[wized="courseLesson_chapterPlayIcon"]');
            const completedMark = link.querySelector('[wized="courseLesson_chapterCompleted"]');
            const completedMark2 = link.querySelector('[wized="courseLesson_chapterCompleted2"]');
    
    
            // Determine visibility based on the 'completed' attribute and 'active' class
            if (isCompleted) {
              if (isActive) {
                // Active and completed
                playIcon.classList.add('hidden');
                completedMark.classList.remove('hidden');
                completedMark2.classList.add('hidden');
              } else {
                // Completed but not active
                playIcon.classList.add('hidden');
                completedMark.classList.add('hidden');
                completedMark2.classList.remove('hidden');
              }
            } else {
              // Not completed
              playIcon.classList.remove('hidden');
              completedMark.classList.add('hidden');
              completedMark2.classList.add('hidden');
              console.log('Not Completed - Hiding all completed marks', playIcon.className, completedMark.className, completedMark2.className);
            }
          });
        } else {
        }
      });
    });
});
