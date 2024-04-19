document.addEventListener('DOMContentLoaded', () => {
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);

    // Set Twitter share link
    const twitterLinks = document.querySelectorAll('[wized="socialShare_x"]');
    twitterLinks.forEach(link => {
        link.href = `https://twitter.com/intent/tweet?text=${pageTitle}&url=${pageUrl}`;
    });

    // Set Facebook share link
    const facebookLinks = document.querySelectorAll('[wized="socialShare_fb"]');
    facebookLinks.forEach(link => {
        link.href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}&quote=${pageTitle}`;
    });

    // Set LinkedIn share link
    const linkedInLinks = document.querySelectorAll('[wized="socialShare_linkedin"]');
    linkedInLinks.forEach(link => {
        link.href = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
    });
});

