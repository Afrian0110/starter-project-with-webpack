import HomePresenter from '../../presenter/home-presenter.js';
import pushNotificationHelper from '../../utils/push-notification.js';

const HomePage = {
  async render() {
    return /*html*/`
      <div style="margin-top: 16px; float: right;">
      <button id="notif-toggle-btn" aria-label="Toggle Push Notification">Toggle Push Notification</button>
      </div>  
      <h2>All Stories</h2>
      <a href="#/add-story" aria-label="Add New Story">Add New Story</a>

      
      <div id="story-list" role="list" aria-live="polite">Loading stories...</div>
      <div id="map" aria-label="Map showing story locations" style="height: 400px; margin-top: 16px;"></div>
      <div style="margin-top: 12px;">
        <label>
          Latitude:
          <input id="lat-display" type="text" readonly style="margin-right: 8px;" />
        </label>
        <label>
          Longitude:
          <input id="lon-display" type="text" readonly />
        </label>
      </div>

    `;
  },

  async afterRender() {
    const user = JSON.parse(localStorage.getItem('storyAppUser'));
    if (!user) {
      location.hash = '#/login';
      return;
    }
    const token = user.token;

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', () => {
      localStorage.removeItem('storyAppUser');
      location.hash = '#/login';
    });

    const storyListEl = document.getElementById('story-list');

    // Map setup
    const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    });

    const satelliteLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: 'Map data © Google'
    });

    const storyMarkers = L.layerGroup();

    const map = L.map('map', {
      center: [0, 0],
      zoom: 2,
      layers: [streetLayer, storyMarkers],
    });

    L.control.layers(
      { 'Street Map': streetLayer, 'Satellite': satelliteLayer },
      { 'Story Markers': storyMarkers }
    ).addTo(map);

    const latInput = document.getElementById('lat-display');
    const lonInput = document.getElementById('lon-display');

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      latInput.value = lat.toFixed(6);
      lonInput.value = lng.toFixed(6);
    });

    const onSuccess = (stories) => {
      if (!stories.length) {
        storyListEl.textContent = 'No stories found.';
        return;
      }

      storyListEl.innerHTML = '';
      stories.forEach((story) => {
        const item = document.createElement('article');
        item.setAttribute('role', 'listitem');
        item.innerHTML = `
          <img src="${story.photoUrl}" alt="Story by ${story.name}" width="150" loading="lazy" />
          <h3>${story.name}</h3>
          <p>${story.description}</p>
          <time datetime="${story.createdAt}">${new Date(story.createdAt).toLocaleString()}</time>
          <a href="#/detail-story/${story.id}" aria-label="View detail of ${story.name}">Details</a>
        `;
        storyListEl.appendChild(item);

        if (story.lat && story.lon) {
          const marker = L.marker([story.lat, story.lon]);
          marker.bindPopup(`
            <strong>${story.name}</strong>
            <p>${story.description}</p>
            <img src="${story.photoUrl}" alt="${story.name}" style="max-width: 150px;" />
          `);
          marker.on('click', () => {
            latInput.value = story.lat;
            lonInput.value = story.lon;
          });
          storyMarkers.addLayer(marker);
        }
      });

      const firstWithLocation = stories.find(story => story.lat && story.lon);
      if (firstWithLocation) {
        map.setView([firstWithLocation.lat, firstWithLocation.lon], 5);
      }
    };

    const onError = (message) => {
      storyListEl.textContent = message;
    };

    HomePresenter.loadStories(token, onSuccess, onError);

    // Push Notification toggle
    const notifBtn = document.getElementById('notif-toggle-btn');
    notifBtn.addEventListener('click', async () => {
      try {
        const swReg = await pushNotificationHelper.registerServiceWorker();
        const existingSub = await swReg.pushManager.getSubscription();

        if (existingSub) {
          // Unsubscribe from both browser and backend
          await pushNotificationHelper.unsubscribeUser(swReg, token);
          alert('Notifikasi dimatikan');
          notifBtn.textContent = 'Subscribe 🔔';
        } else {
          // Request permission and subscribe
          await pushNotificationHelper.requestPermission();
          await pushNotificationHelper.subscribeUser(swReg, token);
          alert('Notifikasi diaktifkan');
          notifBtn.textContent = 'Unsubscribe 🔕';
        }
      } catch (err) {
        console.error('Push Notification error:', err);
        alert(`Gagal mengubah status notifikasi: ${err.message}`);
      }
    });
  }
};

export default HomePage;
