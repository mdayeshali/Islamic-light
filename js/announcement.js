/* =========================================
   Islamic Light - Announcement Loader
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const announcementContainer =
        document.getElementById("announcement-container");

    // Container না থাকলে কিছু করবে না
    if (!announcementContainer) {
        return;
    }

    fetch("includes/announcement.html")
        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "Announcement file could not be loaded."
                );
            }

            return response.text();
        })

        .then(function (html) {

            announcementContainer.innerHTML = html;

        })

        .catch(function (error) {

            console.error(
                "Announcement Error:",
                error
            );

            // Error হলে announcement section দেখাবে না
            announcementContainer.style.display = "none";

        });

});
