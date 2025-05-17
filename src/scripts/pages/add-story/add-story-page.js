import AddStoryPresenter from '../../presenter/add-story-presenter.js';

const AddStoryPage = {
  render() {
    return /*html*/ `
      <main>
        <h2>Add New Story</h2>
        <form id="add-story-form" enctype="multipart/form-data" aria-label="Add new story form">
          <label for="description">Description</label>
          <textarea id="description" name="description" required></textarea>

          <label>Camera Preview</label>
          <video id="camera" width="100%" autoplay muted></video>
          <canvas id="canvas" style="display:none;"></canvas>
          <button type="button" id="capture-btn">📸 Ambil Gambar</button>

          <label for="fileInput">Atau Pilih Gambar dari Perangkat:</label>
          <input type="file" id="fileInput" accept="image/*" />
          <div id="image-preview" style="margin-top:10px;"></div>

          <label>Pick Location (click on map)</label>
          <div id="map" style="height: 300px;"></div>

          <div id="location-display" aria-live="polite" style="margin-top: 8px; font-weight: bold;">
            Belum memilih lokasi
          </div>

          <input type="hidden" id="lat" name="lat" />
          <input type="hidden" id="lon" name="lon" />

          <button type="submit">Submit</button>
        </form>
        <a href="#/home" aria-label="Back to home" style="float: right;">← Back</a>
      </main>
    `;
  },

  afterRender() {
    const user = JSON.parse(localStorage.getItem('storyAppUser'));
    if (!user) {
      location.hash = '#/login';
      return;
    }

    AddStoryPresenter.init({
      user,
      form: document.getElementById('add-story-form'),
      video: document.getElementById('camera'),
      canvas: document.getElementById('canvas'),
      captureBtn: document.getElementById('capture-btn'),
      fileInput: document.getElementById('fileInput'),
      previewContainer: document.getElementById('image-preview'),
      latInput: document.getElementById('lat'),
      lonInput: document.getElementById('lon'),
      locationDisplay: document.getElementById('location-display'),
    });
  },
};

export default AddStoryPage;
