import {
  isRepoHome,
  isRepoRoot,
  isCommit,
  isSingleTag,
  utils,
} from 'github-url-detection';

// import { getFirstCommit } from '.';

const { getRepositoryInfo: getRepo } = utils;

const isBranch = (url) => {
  return !isRepoHome(url) && isRepoRoot(url);
}

const log = (...data: any[]) => {
  chrome.runtime.sendMessage({
    subject: 'console-log',
    payload: data,
  });
};

chrome.runtime.sendMessage({
  subject: 'console-log',
  payload: 'test',
});

const getGitUrl = async (): Promise<string> => {
  let gitUrl: string;
  await new Promise<void>((resolve) => {
    chrome.runtime.sendMessage(
      { subject: 'request-git-url' },
      (res) => {
        gitUrl = res;
        log(res);
      },
    );
    resolve();
  });
  // @ts-ignore
  return gitUrl ?? '';
};

const prefix = 'gitkraken://repolink/';
const firstCommit = 'first_commit_here';
let suffix = '';
const buildSuffix = async () => {
  let gitUrl = await getGitUrl();
  return `?url=${gitUrl}`;
};
buildSuffix();

const linkFormats = {
  repo: `${prefix}${firstCommit}?url=${suffix}`,
  commit: (commit) => `${prefix}${firstCommit}/commit/${commit}?url=${suffix}`,
  branch: (branch) => `${prefix}${firstCommit}/branch/${branch}?url=${suffix}`,
  tag: (tag) => `${prefix}${firstCommit}/tag/${tag}?url=${suffix}`,
};

const buildLink = (url: URL | Location | HTMLAnchorElement | undefined) => {
  const { repo, commit, branch, tag } = linkFormats;
  const info = getRepo(url ?? location);
  let link = repo;
  if (info && !isRepoHome(url)) {
    const { path } = info;
    const builder = (fn: (_: any) => string, splitter: string | RegExp) => {
      return fn(path.split(splitter)[1].split(/\/|\?/)[0]);
    };
    if (isBranch(url)) link = builder(branch, '/tree/');
    else if (isCommit(url)) link = builder(commit, /\/commit.*?\//);
    else if (isSingleTag(url)) link = builder(tag, '/tag/');
  }
  return link;
};

async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function injectedAlert(message) {
  // eslint-disable-next-line no-undef
  alert(message);
}

function injectedWindowOpen(url) {
  // eslint-disable-next-line no-undef
  window.open(url);
}

async function openInGk({ linkUrl, pageUrl }) {
  let tab;
  try {
    tab = await getCurrentTab();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Unexpected error');
    // eslint-disable-next-line no-console
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
        args: [url],
      },
    );
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    await chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: injectedAlert,
        args: [e.message ?? e],
      },
    );
    if (e.name === 'OptionValidationError') {
      chrome.runtime.openOptionsPage();
    }
  }
}

const contextMenuId = 'open-in-gk-context-menu';

chrome.contextMenus.create({
  id: contextMenuId,
  title: 'Open in VSCode',
  contexts: ['link', 'page'],
});

chrome.contextMenus.onClicked.addListener(({ menuItemId, ...info }) => {
  if (menuItemId !== contextMenuId) return;
  const { linkUrl, pageUrl } = info;
  openInGk({ linkUrl, pageUrl });
});

chrome.action.onClicked.addListener((({ url }) => {
  openInGk({ linkUrl: url, pageUrl: url });
}));
