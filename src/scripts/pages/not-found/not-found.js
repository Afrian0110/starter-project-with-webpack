const NotFound = {
  async render() {
    return `
      <section class="not-found">
        <h2>404 - Halaman Tidak Ditemukan</h2>
        <p>Halaman yang kamu cari tidak tersedia.</p>
      </section>
    `;
  },

  async afterRender() {
    // Opsional: tambahkan efek atau logika tambahan
  }
};

export default NotFound;
