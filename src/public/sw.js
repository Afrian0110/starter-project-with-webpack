self.addEventListener('push', function (event) {
  let notificationData = {
    title: 'Dicoding Story',
    options: {
      body: 'Ada notifikasi baru!',
      icon: '/images/logo.png',
    }
  };

  if (event.data) {
    notificationData = event.data.json();
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData.options)
  );
});