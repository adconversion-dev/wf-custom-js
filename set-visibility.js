(function () {
  const authTokenExists = document.cookie.split(';').some(item => item.trim().startsWith('auth_token='));
  const isOnboarded = localStorage.getItem('onboarded') === 'true';

  function clearLocalStorageItems() {
    localStorage.removeItem('full_name');
    localStorage.removeItem('onboarded');
    localStorage.removeItem('profile_image');
  }

  if (!authTokenExists) {
    clearLocalStorageItems();
  }

  function manageVisibility() {
    const style = document.createElement('style');
    document.head.appendChild(style);
    if (authTokenExists) {
      style.sheet.insertRule('[custom-visibility="unauthenticated"] { display: none !important; }', 0);
      style.sheet.insertRule('[custom-visibility="authenticated"] { display: block !important; }', 0);
    } else {
      style.sheet.insertRule('[custom-visibility="unauthenticated"] { display: block !important; }', 0);
      style.sheet.insertRule('[custom-visibility="authenticated"], [custom-visibility="account-settings"] { display: none !important; }', 0);
    }
  }

  manageVisibility();

  // Function to safely parse values from local storage
  function parseLocalStorageItem(item) {
    try {
      return JSON.parse(localStorage.getItem(item));
    } catch (e) {
      return localStorage.getItem(item); // Use as plain string if not JSON
    }
  }

  let fullName = parseLocalStorageItem("full_name");
  let profileImageURL = parseLocalStorageItem("profile_image");

  const userNameElements = document.querySelectorAll('[wized="nav_userName"]');
  const userImageElement = document.querySelector('[wized="nav_userImage"]');

  userNameElements.forEach(userNameElement => {
    if (fullName && fullName !== 'null') {
      userNameElement.textContent = fullName;
      userNameElement.style.display = 'block'; // Show element if fullName is valid
    } else {
      userNameElement.style.display = 'none'; // Hide element if fullName is not valid
    }
  });

  if (userImageElement) {
    if (profileImageURL && profileImageURL !== 'null') {
      userImageElement.src = profileImageURL.replace(/"/g, ''); // Set image URL and remove any quotes
      userImageElement.style.display = 'block'; // Show image element
    } else {
      userImageElement.style.display = 'none'; // Hide image element if URL is not valid
    }
  }

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          if (node.matches('[custom-visibility="account-settings"]') && !isOnboarded) {
            node.classList.add('is-disabled');
            tippy(node, {
              content: 'Complete onboarding to enable this',
              placement: 'top'
            });
            if (node.tagName === 'A') {
              node.removeAttribute('href'); // Remove URL from the link
            }
          }
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  document.querySelectorAll('[custom-visibility="account-settings"]').forEach(el => {
    if (!isOnboarded) {
      el.classList.add('is-disabled');
      tippy(el, {
        content: 'Complete onboarding to enable this',
        placement: 'top'
      });
      if (el.tagName === 'A') {
        el.removeAttribute('href'); // Remove URL from the link
      }
    }
  });

  setTimeout(() => observer.disconnect(), 5000);
})();
