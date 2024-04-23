document.addEventListener('DOMContentLoaded', () => {
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);

    // Set Twitter share link
    const twitterLinks = document.querySelectorAll('[wized="nav_socialShareX"]');
    twitterLinks.forEach(link => {
        link.href = `https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageUrl}`;
    });

    // Set Facebook share link
    const facebookLinks = document.querySelectorAll('[wized="nav_socialShareFb"]');
    facebookLinks.forEach(link => {
        link.href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}&quote=${pageTitle}`;
    });

    // Set LinkedIn share link
    const linkedInLinks = document.querySelectorAll('[wized="nav_socialShareLinkedin"]');
    linkedInLinks.forEach(link => {
        link.href = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
    });
});

