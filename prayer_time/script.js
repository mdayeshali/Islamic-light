const stateSel = document.getElementById('stateSel');
const citySel = document.getElementById('citySel');
const countrySel = document.getElementById('countrySel');
const schoolSel = document.getElementById('schoolSelect');

let userLat, userLon, qiblaAngle = 0;

// Load states
countrySel.onchange = function () {
    fetch("https://countriesnow.space/api/v1/countries/states", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ country: this.value })
    })
    .then(res => res.json())
    .then(data => {
        stateSel.innerHTML = "";
        data.data.states.forEach(s => {
            stateSel.innerHTML += `<option>${s.name}</option>`;
        });
    })
    .catch(() => alert("State load error"));
};

// Load cities
stateSel.onchange = function () {
    fetch("https://countriesnow.space/api/v1/countries/state/cities", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            country: countrySel.value,
            state: this.value
        })
    })
    .then(res => res.json())
    .then(data => {
        citySel.innerHTML = "";
        data.data.forEach(c => {
            citySel.innerHTML += `<option>${c}</option>`;
        });
    });
};

// Load prayer time
citySel.onchange = function () {
    const address = `${citySel.value},${stateSel.value},${countrySel.value}`;

    fetch(`https://api.aladhan.com/v1/timingsByAddress?address=${address}&school=${schoolSel.value}`)
    .then(res => res.json())
    .then(data => showData(data.data));
};

// GPS
function getUserGPS() {
    navigator.geolocation.getCurrentPosition(
        pos => {
            userLat = pos.coords.latitude;
            userLon = pos.coords.longitude;

            fetch(`https://api.aladhan.com/v1/timings?latitude=${userLat}&longitude=${userLon}&school=${schoolSel.value}`)
            .then(res => res.json())
            .then(data => showData(data.data));
        },
        () => alert("লোকেশন অনুমতি দিন")
    );
}

// Show data
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

    // Qibla
    fetch(`https://api.aladhan.com/v1/qibla/${userLat}/${userLon}`)
    .then(res => res.json())
    .then(d => {
        qiblaAngle = d.data.direction;
        document.getElementById("qiblaInfo").innerText =
            "কিবলা: " + qiblaAngle.toFixed(1) + "°";
    });
}

// Compass
window.addEventListener("deviceorientationabsolute", (e) => {
    if (e.alpha !== null) {
        let heading = e.alpha;
        let rotation = qiblaAngle - heading;

        document.getElementById("needle").style.transform =
            `translate(-50%,0) rotate(${rotation}deg)`;
    }
});
