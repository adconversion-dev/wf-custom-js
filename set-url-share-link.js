document.addEventListener('DOMContentLoaded', () => {
    const coursesUrl = encodeURIComponent(window.location.origin + '/courses');

    // Set Twitter share link with a pretext message
    const twitterPretext = encodeURIComponent("I'm loving #AdConversion! Join me and 1,000+ other B2B Marketers leveling up our paid ad skills...");
    const twitterLinks = document.querySelectorAll('[wized="nav_socialShareX"]');
    twitterLinks.forEach(link => {
        link.href = `https://twitter.com/intent/tweet?text=${twitterPretext}&url=${coursesUrl}`;
    });

    // Set Facebook share link without a message
    const facebookLinks = document.querySelectorAll('[wized="nav_socialShareFb"]');
    facebookLinks.forEach(link => {
        link.href = `https://www.facebook.com/sharer/sharer.php?u=${coursesUrl}`;
    });

    // Set LinkedIn share link without a message
    const linkedInLinks = document.querySelectorAll('[wized="nav_socialShareLinkedin"]');
    linkedInLinks.forEach(link => {
        link.href = `https://www.linkedin.com/sharing/share-offsite/?url=${coursesUrl}`;
    });
});
