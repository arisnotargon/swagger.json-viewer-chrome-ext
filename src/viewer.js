chrome.runtime.sendMessage({ action: "getSwaggerJson" }, (response) => {
  const spec = response && response.json;
  if (spec) {
    SwaggerUIBundle({
      spec,
      dom_id: "#swagger-ui",
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
      layout: "StandaloneLayout"
    });
  } else {
    document.body.innerHTML = "<pre>无法加载 swagger.json</pre>";
  }
});