// Функция для проверки, отображена ли боковая панель
function isSidebarVisible() {
  var views = browser.extension.getViews({ type: "sidebar" });
  return views.length > 0;
}

// Создаем элемент контекстного меню при установке расширения
browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: 'openInSidebar',
    title: 'Open in Sidebar',
    contexts: ['link', 'page'] // на ссылках и страницах
  });
});

// Добавляем обработчик перед отправкой заголовков для изменения user-agent
browser.webRequest.onBeforeSendHeaders.addListener(
  function (details) {
    // Проверяем, что боковая панель отображена
    if (isSidebarVisible()) {
      // Изменяем заголовок User-Agent на мобильный
      for (var i = 0; i < details.requestHeaders.length; ++i) {
        if (details.requestHeaders[i].name === 'User-Agent') {
          details.requestHeaders[i].value = 'Mozilla/5.0 (Mobile; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0';
          break;
        }
      }
      return { requestHeaders: details.requestHeaders };
    }
  },
  { urls: ["<all_urls>"] }, // Применяем к любому URL
  ["blocking", "requestHeaders"]
);

// Обработчик кликов по элементу контекстного меню
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'openInSidebar') {
    // Определяем URL для открытия: приоритет на info.linkUrl, затем info.pageUrl и, наконец, tab.url
    let url = info.linkUrl || info.pageUrl || tab.url;
    // Добавляем обработчик перед отправкой заголовков для изменения user-agent
    browser.webRequest.onBeforeSendHeaders.addListener(
      function (details) {
        // Проверяем, что боковая панель отображена
        if (isSidebarVisible()) {
          // Изменяем заголовок User-Agent на мобильный
          for (var i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name === 'User-Agent') {
              details.requestHeaders[i].value = 'Mozilla/5.0 (Mobile; Win64; x64; rv:127.0) Gecko/20100101 Firefox/127.0';
              break;
            }
          }
          return { requestHeaders: details.requestHeaders };
        }
      },
      { urls: ["<all_urls>"] }, // Применяем к любому URL
      ["blocking", "requestHeaders"]
    );
    // Открываем ссылку в боковой панели
    browser.sidebarAction.setPanel({ panel: `sidebar.html?url=${encodeURIComponent(url)}` });
  }
});
