// src/background.ts
var log = (msg) => console.log(msg);
chrome.runtime.onMessage.addListener((data) => {
  if (data.type === "notification") {
    log(data.message);
  }
});
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "open-context-menu-link-in-gitkraken",
    title: "Open this link in GitKraken %s",
    contexts: ["link"]
  });
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if ("notify" === info.menuItemId) {
    log(info.selectionText);
  }
});
//# sourceMappingURL=background.js.map