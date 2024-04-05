// Function to check for authToken cookie
function checkAuthToken() {
  return document.cookie
    .split(";")
    .some((item) => item.trim().startsWith("authToken="));
}

document.addEventListener("DOMContentLoaded", function () {
  const authTokenExists = checkAuthToken();

  function updateUserDetails(authTokenExists) {
    const fullName = localStorage.getItem("full_name");
    const profileImageURL = localStorage.getItem("profile_image");

    // Update user's details only if authToken exists
    if (authTokenExists) {
      const userNameElement = document.querySelector('[wized="navUserName"]');
      const userImageElement = document.querySelector('[wized="navUserImage"]');

      if (userNameElement && fullName) {
        userNameElement.textContent = JSON.parse(fullName);
        userNameElement.removeAttribute("custom-cloak"); // Reveal the element
      }

      if (userImageElement) {
        if (profileImageURL && profileImageURL !== "null") {
          userImageElement.src = JSON.parse(profileImageURL);
          userImageElement.removeAttribute("custom-cloak"); // Reveal the element
        } else {
          userImageElement.remove();
        }
      }
    }
  }

  updateUserDetails(authTokenExists);

  // Manage visibility based on authToken existence
  document
    .querySelectorAll('[custom-visibility="authenticated"]')
    .forEach((element) => {
      if (authTokenExists) {
        element.removeAttribute("custom-cloak"); // Reveal the element
      }
    });

  document
    .querySelectorAll('[custom-visibility="unauthenticated"]')
    .forEach((element) => {
      if (!authTokenExists) {
        element.removeAttribute("custom-cloak"); // Reveal the element
      } else {
        element.remove(); // Remove the element if it shouldn't be visible
      }
    });
});
