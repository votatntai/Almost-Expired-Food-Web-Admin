importScripts('https://www.gstatic.com/firebasejs/9.0.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.1/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDqrvt4F4XqPjMfkDhb5DYKLzSUYaWz-zI",
    authDomain: "almost-expired-food-887dd.firebaseapp.com",
    projectId: "almost-expired-food-887dd",
    storageBucket: "almost-expired-food-887dd.appspot.com",
    messagingSenderId: "637102657592",
    appId: "1:637102657592:web:c48b9184ff0b0031d696cd",
    measurementId: "G-VNP2NBN8NJ"
});

const messaging = firebase.messaging();

console.log('asdsad');

messaging.onBackgroundMessage((payload) => {
    self.registration.getNotifications().then((notifications) => {
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
            body: payload.notification.body,
            icon: '/assets/icons/icon-72x72.png',
            renotify: false,
            timestamp: Date.now()
        };

        // Kiểm tra xem có thông báo nào đang được hiển thị hay không
        if (notifications.some(notification => notification.title === notificationTitle && notification.body === notificationOptions.body)) {
            return;
        }

        // Hiển thị thông báo nếu không có thông báo nào đang được hiển thị
        self.registration.showNotification(notificationTitle, notificationOptions);
    });
});