fetch('/includes/announcement.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('announcement').innerHTML = data;
    })
    .catch(error => console.error('Announcement load error:', error));
