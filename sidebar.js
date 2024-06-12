// Получаем URL из параметров
const urlParams = new URLSearchParams(window.location.search);
const url = urlParams.get('url');

// Перенаправляем на указанный URL
if (url) {
  window.location.href = url;
} else {
  window.location.href = 'https://youtube.com';
}