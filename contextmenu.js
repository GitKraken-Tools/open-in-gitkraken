// src/contextmenu.ts
var import_github_url_detection = require("github-url-detection");
var { getRepositoryInfo: getRepo } = import_github_url_detection.utils;
var firstCommit = "first_commit_here";
var linkFormats = {
  repo: `gitkraken://repolink/${firstCommit}?url=true`,
  commit: (commit) => `gitkraken://repolink/${firstCommit}/commit/${commit}?url=true`,
  branch: (branch) => `gitkraken://repolink/${firstCommit}/branch/${branch}?url=true`,
  tag: (tag) => `gitkraken://repolink/${firstCommit}/tag/${tag}?url=true`
};
var PULL_REQUEST_PATH_REGEXP = /.+\/([^/]+)\/(pull)\/[^/]+\/(.*)/;
var OptionValidationError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "OptionValidationError";
  }
};
async function getOptions() {
  const options = await chrome.storage.sync.get({
    remoteHost: "",
    basePath: "",
    debug: false
  });
  if (options.basePath === "") {
    throw new OptionValidationError("Looks like you haven't configured this extension yet. You can find more information about this by visiting the extension's README page.");
  }
  return options;
}
function getGkLink({
  repo,
  file,
  isFolder,
  line
}, {
  remoteHost,
  basePath,
  debug
}) {
  let gkLink = "gk";
  if (remoteHost !== "") {
    gkLink += `://gk-remote/ssh-remote+${remoteHost}`;
  } else {
    gkLink += "://file";
  }
  if (basePath[0] !== "/") {
    gkLink += "/";
  }
  gkLink += `${basePath}/${repo}/${file}`;
  if (isFolder) {
    gkLink += "/";
  }
  if (line) {
    gkLink += `:${line}:1`;
  }
  if (debug) {
    console.log(`About to open link: ${gkLink}`);
  }
  return gkLink;
}
function isPR(linkUrl) {
  return PULL_REQUEST_PATH_REGEXP.test(linkUrl);
}
function parseLink(linkUrl, selectionText, pageUrl) {
  const url = new URL(linkUrl ?? pageUrl);
  const path = url.pathname;
  if (isPR(url.pathname)) {
    const pathInfo2 = PULL_REQUEST_PATH_REGEXP.exec(path);
    const repo2 = pathInfo2[1];
    const isFolder2 = false;
    const file2 = selectionText;
    let line2 = null;
    if (pageUrl.includes(linkUrl)) {
      line2 = pageUrl.replace(linkUrl, "").replace("R", "").replace("L", "");
    }
    return {
      repo: repo2,
      file: file2,
      isFolder: isFolder2,
      line: line2
    };
  }
  const pathRegexp = /.+\/([^/]+)\/(blob|tree)\/[^/]+\/(.*)/;
  if (!pathRegexp.test(path)) {
    throw new Error(`Invalid link. Could not extract info from: ${path}.`);
  }
  const pathInfo = pathRegexp.exec(path);
  const repo = pathInfo[1];
  const isFolder = pathInfo[2] === "tree";
  const file = pathInfo[3];
  let line;
  if (url.hash.indexOf("#L") === 0) {
    line = url.hash.substring(2);
  }
  return {
    repo,
    file,
    isFolder,
    line
  };
}
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
async function openInGk({ linkUrl, selectionText, pageUrl }) {
  let tab;
  try {
    tab = await getCurrentTab();
  } catch (e) {
    console.error("Unexpected error");
    console.error(e);
    return;
  }
  try {
    const options = await getOptions();
    const parsedLinkData = parseLink(linkUrl, selectionText, pageUrl);
    const url = getGkLink(parsedLinkData, options);
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
  if (menuItemId !== contextMenuId) {
    return;
  }
  openInGk(info);
});
chrome.action.onClicked.addListener(({ url }) => {
  openInGk({ linkUrl: url, pageUrl: url });
});
//# sourceMappingURL=contextmenu.js.map