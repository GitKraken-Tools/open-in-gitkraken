// src/contextmenu.ts
var import_github_url_detection = require("github-url-detection");
var { getRepositoryInfo: getRepo } = import_github_url_detection.utils;
var isBranch = (url) => {
  return !(0, import_github_url_detection.isRepoHome)(url) && (0, import_github_url_detection.isRepoRoot)(url);
};
var prefix = "gitkraken://repolink/";
var firstCommit = "first_commit_here";
var _a;
var suffix = `?url=${encodeURIComponent((_a = document.querySelector('meta[name="go-import"]')) == null ? void 0 : _a.content.split(" ")[2])}`;
var linkFormats = {
  repo: `${prefix}${firstCommit}?url=${suffix}`,
  commit: (commit) => `${prefix}${firstCommit}/commit/${commit}?url=${suffix}`,
  branch: (branch) => `${prefix}${firstCommit}/branch/${branch}?url=${suffix}`,
  tag: (tag) => `${prefix}${firstCommit}/tag/${tag}?url=${suffix}`
};
var buildLink = (url) => {
  const { repo, commit, branch, tag } = linkFormats;
  const info = getRepo(url ?? location);
  let link = repo;
  if (info && !(0, import_github_url_detection.isRepoHome)(url)) {
    const { path } = info;
    const builder = (fn, splitter) => {
      return fn(path.split(splitter)[1].split(/\/|\?/)[0]);
    };
    if (isBranch(url))
      link = builder(branch, "/tree/");
    else if ((0, import_github_url_detection.isCommit)(url))
      link = builder(commit, /\/commit.*?\//);
    else if ((0, import_github_url_detection.isSingleTag)(url))
      link = builder(tag, "/tag/");
  }
  return link;
};
async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}
function injectedAlert(message) {
  alert(message);
}
function injectedWindowOpen(url) {
  window.open(url);
}
async function openInGk({ linkUrl, pageUrl }) {
  let tab;
  try {
    tab = await getCurrentTab();
  } catch (e) {
    console.error("Unexpected error");
    console.error(e);
    return;
  }
  try {
    const parsedLinkData = new URL(linkUrl ?? pageUrl);
    const url = buildLink(parsedLinkData);
    await chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: injectedWindowOpen,
        args: [url]
      }
    );
  } catch (e) {
    console.error(e);
    await chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: injectedAlert,
        args: [e.message ?? e]
      }
    );
    if (e.name === "OptionValidationError") {
      chrome.runtime.openOptionsPage();
    }
  }
}
var contextMenuId = "open-in-gk-context-menu";
chrome.contextMenus.create({
  id: contextMenuId,
  title: "Open in VSCode",
  contexts: ["link", "page"]
});
chrome.contextMenus.onClicked.addListener(({ menuItemId, ...info }) => {
  if (menuItemId !== contextMenuId)
    return;
  const { linkUrl, pageUrl } = info;
  openInGk({ linkUrl, pageUrl });
});
chrome.action.onClicked.addListener(({ url }) => {
  openInGk({ linkUrl: url, pageUrl: url });
});
//# sourceMappingURL=contextmenu.js.map