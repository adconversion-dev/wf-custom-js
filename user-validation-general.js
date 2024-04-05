// Function to check for authToken cookie immediately and use it for logic after DOM is loaded
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

      // Update the user's full name
      if (userNameElement && fullName) {
        userNameElement.textContent = JSON.parse(fullName);
      }

      // Set the user's profile image or remove the element if the URL is null or empty
      if (userImageElement) {
        if (profileImageURL && profileImageURL !== "null") {
          userImageElement.src = JSON.parse(profileImageURL);
        } else {
          userImageElement.remove(); // Remove if no valid profile image URL
        }
      }
    }
  }

  updateUserDetails(authTokenExists);

  // Manage visibility based on authToken existence
  const authenticatedElements = document.querySelectorAll(
    '[custom-visibility="authenticated"]',
  );
  const unauthenticatedElements = document.querySelectorAll(
    '[custom-visibility="unauthenticated"]',
  );

  if (authTokenExists) {
    authenticatedElements.forEach((element) => (element.style.display = ""));
    unauthenticatedElements.forEach((element) => element.remove());
  } else {
    authenticatedElements.forEach((element) => element.remove());
    unauthenticatedElements.forEach((element) => (element.style.display = ""));
  }
});
