!function(){function o(o){let e=`; ${document.cookie}`,t=e.split(`; ${o}=`);if(2===t.length)return t.pop().split(";").shift()}if(o("auth_token")&&["https://adconversion-academy-wized.webflow.io","https://www.adconversion-academy-wized.webflow.io"].includes(window.location.origin)){let e=o("auth_token");if(window.location.hash){let t=window.location.hash.substring(1).split("+")[0];if(t){let i=`https://www.adconversion-dev.com/api:JJmw0c4k/course/lesson/offline-checker?course_slug=${t}`;fetch(i,{method:"GET",headers:{Authorization:`Bearer ${e}`}}).then(o=>o.json()).then(o=>{!1===o&&(window.location.href="/courses")}).catch(o=>{console.error("Error:",o)})}}}}();
