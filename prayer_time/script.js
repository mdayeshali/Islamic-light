let userLat, userLon, qiblaAngle = 0;

// 📡 AUTO LOCATION
function getUserGPS() {
    if (!navigator.geolocation) {
        alert("GPS support নেই");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        async (pos) => {
            userLat = pos.coords.latitude;
            userLon = pos.coords.longitude;

            try {
                // 🌍 Reverse Geocoding
                const geoRes = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${userLat}&lon=${userLon}&format=json`
                );
                const geoData = await geoRes.json();

                const addr = geoData.address;

                const city =
                    addr.city ||
                    addr.town ||
                    addr.village ||
                    "Unknown";

                const state = addr.state || "";
                const country = addr.country || "";

                document.getElementById("locationText").innerText =
                    `📍 ${city}, ${state}, ${country}`;

                // 🕌 Prayer Time
                const res = await fetch(
                    `https://api.aladhan.com/v1/timings?latitude=${userLat}&longitude=${userLon}`
                );

                const data = await res.json();
                showData(data.data);

            } catch (err) {
                alert("লোকেশন নিতে সমস্যা হচ্ছে");
                console.log(err);
            }
        },
        () => alert("লোকেশন অনুমতি দিন")
    );
}

// 🕌 Show Prayer Data
function showData(data) {
    userLat = data.meta.latitude;
    userLon = data.meta.longitude;

    const t = data.timings;

    document.getElementById("hijriDate").innerText =
        data.date.hijri.date + " হিজরি";

    document.getElementById("prayerList").innerHTML = `
        <div class="prayer"><span>ফজর</span><span>${t.Fajr}</span></div>
        <div class="prayer"><span>যোহর</span><span>${t.Dhuhr}</span></div>
        <div class="prayer"><span>আসর</span><span>${t.Asr}</span></div>
        <div class="prayer"><span>মাগরিব</span><span>${t.Maghrib}</span></div>
        <div class="prayer"><span>ইশা</span><span>${t.Isha}</span></div>
    `;

    // 🧭 Qibla Direction
    fetch(`https://api.aladhan.com/v1/qibla/${userLat}/${userLon}`)
    .then(res => res.json())
    .then(d => {
        qiblaAngle = d.data.direction;
        document.getElementById("qiblaInfo").innerText =
            "কিবলা: " + qiblaAngle.toFixed(1) + "°";
    });
}

// 🧭 Compass FIX
window.addEventListener("deviceorientationabsolute", (e) => {
    if (e.alpha !== null) {
        let heading = e.alpha;
        let rotation = qiblaAngle - heading;

        document.getElementById("needle").style.transform =
            `translate(-50%,0) rotate(${rotation}deg)`;
    }
});
