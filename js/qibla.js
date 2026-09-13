document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const compassDial = document.getElementById('compassDial');
  const qiblaNeedle = document.getElementById('qiblaNeedle');
  const qiblaAngleText = document.getElementById('qiblaAngleText');
  const currentHeadingText = document.getElementById('currentHeadingText');
  const statusMessage = document.getElementById('statusMessage');
  const enableSensorBtn = document.getElementById('enableSensorBtn');

  // Kaaba Coordinates (Makkah)
  const KAABA_LAT = 21.422487;
  const KAABA_LNG = 39.826206;

  let qiblaBearing = 0;
  let isLocationReady = false;

  // Calculate Great-Circle Bearing from user to Kaaba
  function calculateQibla(latitude, longitude) {
    const lat1 = (latitude * Math.PI) / 180;
    const lat2 = (KAABA_LAT * Math.PI) / 180;
    const dLng = ((KAABA_LNG - longitude) * Math.PI) / 180;

    const y = Math.sin(dLng);
    const x = Math.cos(lat1) * Math.tan(lat2) - Math.sin(lat1) * Math.cos(dLng);

    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    return (bearing + 360) % 360;
  }

  // Request GPS Location
  function fetchLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('আপনার ব্রাউজার লোকেশন সমর্থন করে না।'));
        return;
      }

      statusMessage.innerText = 'লোকেশন শনাক্ত করা হচ্ছে...';

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          qiblaBearing = calculateQibla(latitude, longitude);
          
          qiblaAngleText.innerText = `${Math.round(qiblaBearing)}°`;
          // Position Kaaba pointer relative to dial's North
          qiblaNeedle.style.transform = `rotate(${qiblaBearing}deg)`;
          
          isLocationReady = true;
          statusMessage.innerText = 'ফোনটি ডানে বা বামে ঘুরিয়ে কিবলা সোজা করুন।';
          resolve();
        },
        (error) => {
          let errText = 'লোকেশন পাওয়া যায়নি। অনুগ্রহ করে পারমিশন দিন।';
          if (error.code === error.PERMISSION_DENIED) {
            errText = 'লোকেশন পারমিশন বাতিল করা হয়েছে।';
          }
          statusMessage.innerText = errText;
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }

  // Handle Orientation Changes
  function onOrientationChange(event) {
    let heading = null;

    // iOS WebKit
    if (typeof event.webkitCompassHeading !== 'undefined') {
      heading = event.webkitCompassHeading;
    } 
    // Android / Standard (Absolute orientation is preferred)
    else if (event.alpha !== null) {
      heading = (360 - event.alpha) % 360;
    }

    if (heading !== null) {
      const roundedHeading = Math.round(heading);
      currentHeadingText.innerText = `${roundedHeading}°`;

      // Rotate dial against phone rotation to keep North upright
      compassDial.style.transform = `rotate(${-heading}deg)`;

      // Feedback when user is aligned with Qibla (tolerance ±3°)
      if (isLocationReady) {
        const diff = Math.abs((heading - qiblaBearing + 360) % 360);
        if (diff <= 3 || diff >= 357) {
          statusMessage.innerText = 'মাশাআল্লাহ! আপনি কিবলার মুখোমুখি আছেন।';
          statusMessage.style.color = '#1b5e20';
          statusMessage.style.fontWeight = '600';
        } else {
          statusMessage.innerText = 'ফোনটি ঘুরিয়ে কাবার আইকনটি উপরের তিরের সাথে মেলান।';
          statusMessage.style.color = '';
          statusMessage.style.fontWeight = 'normal';
        }
      }
    }
  }

  // Bind Compass Events
  async function startCompass() {
    try {
      await fetchLocation();

      // iOS 13+ requires explicit user gesture permission for orientation
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          window.addEventListener('deviceorientation', onOrientationChange, true);
          enableSensorBtn.style.display = 'none';
        } else {
          statusMessage.innerText = 'সেন্সর পারমিশন দেওয়া হয়নি।';
        }
      } else {
        // Android and standard desktop/mobile browsers
        window.addEventListener('deviceorientationabsolute', onOrientationChange, true);
        window.addEventListener('deviceorientation', onOrientationChange, true);
        enableSensorBtn.style.display = 'none';
      }
    } catch (err) {
      console.error(err);
    }
  }

  enableSensorBtn.addEventListener('click', startCompass);
});
