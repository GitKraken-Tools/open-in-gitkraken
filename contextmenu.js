// node_modules/github-url-detection/distribution/index.js
var reservedNames = [
  "400",
  "401",
  "402",
  "403",
  "404",
  "405",
  "406",
  "407",
  "408",
  "409",
  "410",
  "411",
  "412",
  "413",
  "414",
  "415",
  "416",
  "417",
  "418",
  "419",
  "420",
  "421",
  "422",
  "423",
  "424",
  "425",
  "426",
  "427",
  "428",
  "429",
  "430",
  "431",
  "500",
  "501",
  "502",
  "503",
  "504",
  "505",
  "506",
  "507",
  "508",
  "509",
  "510",
  "511",
  "about",
  "access",
  "account",
  "admin",
  "advisories",
  "anonymous",
  "any",
  "api",
  "apps",
  "attributes",
  "auth",
  "billing",
  "blob",
  "blog",
  "bounty",
  "branches",
  "business",
  "businesses",
  "c",
  "cache",
  "case-studies",
  "categories",
  "central",
  "certification",
  "changelog",
  "cla",
  "cloud",
  "codereview",
  "collection",
  "collections",
  "comments",
  "commit",
  "commits",
  "community",
  "companies",
  "compare",
  "contact",
  "contributing",
  "cookbook",
  "coupons",
  "customer-stories",
  "customer",
  "customers",
  "dashboard",
  "dashboards",
  "design",
  "develop",
  "developer",
  "diff",
  "discover",
  "discussions",
  "docs",
  "downloads",
  "downtime",
  "editor",
  "editors",
  "edu",
  "enterprise",
  "events",
  "explore",
  "featured",
  "features",
  "files",
  "fixtures",
  "forked",
  "garage",
  "ghost",
  "gist",
  "gists",
  "graphs",
  "guide",
  "guides",
  "help",
  "help-wanted",
  "home",
  "hooks",
  "hosting",
  "hovercards",
  "identity",
  "images",
  "inbox",
  "individual",
  "info",
  "integration",
  "interfaces",
  "introduction",
  "invalid-email-address",
  "investors",
  "issues",
  "jobs",
  "join",
  "journal",
  "journals",
  "lab",
  "labs",
  "languages",
  "launch",
  "layouts",
  "learn",
  "legal",
  "library",
  "linux",
  "listings",
  "lists",
  "login",
  "logos",
  "logout",
  "mac",
  "maintenance",
  "malware",
  "man",
  "marketplace",
  "mention",
  "mentioned",
  "mentioning",
  "mentions",
  "migrating",
  "milestones",
  "mine",
  "mirrors",
  "mobile",
  "navigation",
  "network",
  "new",
  "news",
  "none",
  "nonprofit",
  "nonprofits",
  "notices",
  "notifications",
  "oauth",
  "offer",
  "open-source",
  "organisations",
  "organizations",
  "orgs",
  "pages",
  "partners",
  "payments",
  "personal",
  "plans",
  "plugins",
  "popular",
  "popularity",
  "posts",
  "press",
  "pricing",
  "professional",
  "projects",
  "pulls",
  "raw",
  "readme",
  "recommendations",
  "redeem",
  "releases",
  "render",
  "reply",
  "repositories",
  "resources",
  "restore",
  "revert",
  "save-net-neutrality",
  "saved",
  "scraping",
  "search",
  "security",
  "services",
  "sessions",
  "settings",
  "shareholders",
  "shop",
  "showcases",
  "signin",
  "signup",
  "site",
  "spam",
  "sponsors",
  "ssh",
  "staff",
  "starred",
  "stars",
  "static",
  "status",
  "statuses",
  "storage",
  "store",
  "stories",
  "styleguide",
  "subscriptions",
  "suggest",
  "suggestion",
  "suggestions",
  "support",
  "suspended",
  "talks",
  "teach",
  "teacher",
  "teachers",
  "teaching",
  "team",
  "teams",
  "ten",
  "terms",
  "timeline",
  "topic",
  "topics",
  "tos",
  "tour",
  "train",
  "training",
  "translations",
  "tree",
  "trending",
  "updates",
  "username",
  "users",
  "visualization",
  "w",
  "watching",
  "wiki",
  "windows",
  "works-with",
  "www0",
  "www1",
  "www2",
  "www3",
  "www4",
  "www5",
  "www6",
  "www7",
  "www8",
  "www9"
];
var isCommit = (url = location) => isSingleCommit(url) || isPRCommit(url);
var isDashboard = (url = location) => !isGist(url) && /^$|^(orgs\/[^/]+\/)?dashboard(\/|$)/.test(getCleanPathname(url));
var isGist = (url = location) => typeof getCleanGistPathname(url) === "string";
var isPRCommit = (url = location) => {
  var _a;
  return /^pull\/\d+\/commits\/[\da-f]{5,40}$/.test((_a = getRepo(url)) == null ? void 0 : _a.path);
};
var isSingleTag = (url = location) => {
  var _a;
  return /^(releases\/tag)/.test((_a = getRepo(url)) == null ? void 0 : _a.path);
};
var isRepo = (url = location) => /^[^/]+\/[^/]+/.test(getCleanPathname(url)) && !reservedNames.includes(url.pathname.split("/", 2)[1]) && !isDashboard(url) && !isGist(url) && !isNewRepoTemplate(url);
var isRepoHome = (url = location) => {
  var _a;
  return ((_a = getRepo(url)) == null ? void 0 : _a.path) === "";
};
var isRepoRoot = (url) => {
  const repository = getRepo(url ?? location);
  if (!repository) {
    return false;
  }
  if (!repository.path) {
    return true;
  }
  if (url) {
    return /^tree\/[^/]+$/.test(repository.path);
  }
  return repository.path.startsWith("tree/") && document.title.startsWith(repository.nameWithOwner) && !document.title.endsWith(repository.nameWithOwner);
};
var isSingleCommit = (url = location) => {
  var _a;
  return /^commit\/[\da-f]{5,40}$/.test((_a = getRepo(url)) == null ? void 0 : _a.path);
};
var isNewRepoTemplate = (url = location) => Boolean(url.pathname.split("/")[3] === "generate");
var getUsername = () => {
  var _a;
  return (_a = document.querySelector('meta[name="user-login"]')) == null ? void 0 : _a.getAttribute("content");
};
var getCleanPathname = (url = location) => url.pathname.replace(/\/+/g, "/").slice(1, url.pathname.endsWith("/") ? -1 : void 0);
var getCleanGistPathname = (url = location) => {
  const pathname = getCleanPathname(url);
  if (url.hostname.startsWith("gist.")) {
    return pathname;
  }
  const [gist, ...parts] = pathname.split("/");
  return gist === "gist" ? parts.join("/") : void 0;
};
var getRepo = (url) => {
  if (!url) {
    const canonical = document.querySelector('[property="og:url"]');
    if (canonical) {
      const canonicalUrl = new URL(canonical.content, location.origin);
      if (getCleanPathname(canonicalUrl).toLowerCase() === getCleanPathname(location).toLowerCase()) {
        url = canonicalUrl;
      }
    }
  }
  if (typeof url === "string") {
    url = new URL(url, location.origin);
  }
  if (!isRepo(url)) {
    return;
  }
  const [owner, name, ...path] = getCleanPathname(url).split("/");
  return {
    owner,
    name,
    nameWithOwner: owner + "/" + name,
    path: path.join("/")
  };
};
var utils = {
  getUsername,
  getCleanPathname,
  getCleanGistPathname,
  getRepositoryInfo: getRepo
};

// src/contextmenu.ts
var { getRepositoryInfo: getRepo2 } = utils;
var isBranch = (url) => {
  return !isRepoHome(url) && isRepoRoot(url);
};
var getGitUrl = async () => {
  let gitUrl;
  await new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { subject: "request-git-url" },
      (res) => gitUrl = res
    );
    resolve();
  });
  return gitUrl ?? "";
};
var prefix = "gitkraken://repolink/";
var firstCommit = "first_commit_here";
var suffix = "";
var buildSuffix = async () => {
  let gitUrl = await getGitUrl();
  return `?url=${gitUrl}`;
};
buildSuffix();
var linkFormats = {
  repo: `${prefix}${firstCommit}?url=${suffix}`,
  commit: (commit) => `${prefix}${firstCommit}/commit/${commit}?url=${suffix}`,
  branch: (branch) => `${prefix}${firstCommit}/branch/${branch}?url=${suffix}`,
  tag: (tag) => `${prefix}${firstCommit}/tag/${tag}?url=${suffix}`
};
var buildLink = (url) => {
  const { repo, commit, branch, tag } = linkFormats;
  const info = getRepo2(url ?? location);
  let link = repo;
  if (info && !isRepoHome(url)) {
    const { path } = info;
    const builder = (fn, splitter) => {
      return fn(path.split(splitter)[1].split(/\/|\?/)[0]);
    };
    if (isBranch(url))
      link = builder(branch, "/tree/");
    else if (isCommit(url))
      link = builder(commit, /\/commit.*?\//);
    else if (isSingleTag(url))
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