function isSidebarVisible() {
    var views = chrome.extension.getViews({ type: "sidebar" });
    return views.length > 0;
  }
  
  chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
      // Проверяем, что боковая панель отображена
      if (isSidebarVisible()) {
        for (var i = 0; i < details.requestHeaders.length; ++i) {
          if (details.requestHeaders[i].name === 'User-Agent') {
            details.requestHeaders[i].value = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';
            break;
          }
        }
        return { requestHeaders: details.requestHeaders };
      }
    },
    { urls: ["<all_urls>"] },
    ["blocking", "requestHeaders"]
  );
  