(async function () {
    console.log("Swagger/OpenAPI JSON Viewer content script running...",document.body.children.length);

  // 只处理纯文本页面
  if (!document.body || document.body.children.length > 1) return;

  let json;
  try {
    json = JSON.parse(document.body.innerText);
  } catch {
    console.log("Not a valid JSON document. Skip.");
    return;
  }
  if (!json.swagger && !json.openapi) {
    console.log("Not a Swagger/OpenAPI file: swagger or openapi key not found. Skip.");
    return
  };

  console.log("Swagger/OpenAPI JSON detected:", json);
  // 打开 viewer.html 并传递 JSON
    chrome.runtime.sendMessage({ action: "openSwaggerViewer", json });

})();