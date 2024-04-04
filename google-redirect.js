const storedUrl = localStorage.getItem("redirectToAfterGoogle");
if (storedUrl) {
  const currentUrlParams = window.location.search;
  const newUrl = new URL(storedUrl);
  newUrl.search = currentUrlParams;

  window.location.href = newUrl.href;
} else {
  console.log("No stored URL found for redirection.");
}
//
