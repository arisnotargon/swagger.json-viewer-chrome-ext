chrome.action.onClicked.addListener(async (tab) => {
    console.log("Swagger/OpenAPI JSON Viewer extension clicked on tab:", tab.id);
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["content.js"]
  });
});

let lastSwaggerJson = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openSwaggerViewer" && message.json) {
    lastSwaggerJson = message.json;
    chrome.tabs.create({
      url: chrome.runtime.getURL("viewer.html")
    });
  }
});

// 提供接口让 viewer.js 获取 json
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getSwaggerJson") {
    sendResponse({ json: lastSwaggerJson });
  }
});