document.addEventListener("DOMContentLoaded",function(){var e=document.querySelectorAll('[wized="logout"]');let o=window.location.origin.includes("server.wized.com")?"/v2/page/proxy?url=https://adconversion-academy-wized.webflow.io":window.location.origin;e.forEach(function(e){e.addEventListener("click",function(){document.cookie="auth_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/",localStorage.removeItem("full_name"),localStorage.removeItem("onboarded"),localStorage.removeItem("profile_image"),localStorage.removeItem("course_details"),localStorage.removeItem("offline_courses"),localStorage.removeItem("autoplay"),window.location.href=`${o}/auth/log-in`})})});
