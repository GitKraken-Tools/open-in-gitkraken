import initializePushstateEvent from 'pushstate-js';
import waitForElement from './waitForElement.js';
import getGkLogo from './getGkLogo.js';

const dropdownLinkClass = 'gk-link';
const alreadyInjected = (): boolean => document.getElementsByClassName(dropdownLinkClass).length > 0;

let cancelRender: (() => void) | undefined = undefined;

const render = async () => {
  if (alreadyInjected()) return;
  console.log();
  if (typeof cancelRender === 'function') cancelRender(); // Cancel the current render process if it's still running
  const controller = new AbortController(); // Create a new controller for this render process
  cancelRender = () => controller.abort(); // Set the cancelRender function to abort the new controller
  const modal = await waitForElement('div [data-target="get-repo.modal"] ul', controller)[0]; // Wait for the modal element to become available and pass in the abort controller

  const modalChildren = modal ? Array.from(modal.children) : []; // The clone dropdown element
  if (!modalChildren.length) return; // If no modal children are found, return

  const repoUrl: string = (modalChildren.find(elem => elem.matches('li:first-of-type'))?.querySelector('input[data-autoselect]') as HTMLInputElement)?.value || ''; // The copy link
  const repoUrlParts = repoUrl.split('/'); // Split the url into parts
  const numCommits = Number((document.querySelector('svg.octicon-history')?.nextElementSibling?.querySelector('strong')?.textContent ?? '').replace(/,/g, '')); // Extract the number of commits in the repo
  if (repoUrlParts.length < 4 || numCommits === 0) return; // If the url is invalid, return

  const user = repoUrl.split('/')[3]; // Extract the user from the link
  const repo = repoUrl.split('/')[4].replace('.git', ''); // Extract the repo name from the link
  const sha = await getFirstCommit(user, repo, numCommits, controller); // Fetch the first commit
  if (sha) {
    const secondFromLast = modalChildren.reverse().find(elem => elem.matches('li:nth-last-child(1)'));
    if (!secondFromLast || alreadyInjected()) return; // If the link was already added, abort
    secondFromLast.insertAdjacentHTML('beforebegin', createLink(repoUrl, sha));
  }
};

const getFirstCommit = async (user: string, repo: string, numCommits: number, controller: AbortController) => {
  if (numCommits === 0) { return null; }
  const fetchUrl = `https://api.github.com/repos/${user}/${repo}/commits?per_page=1&page=${numCommits}`;
  return await fetch(fetchUrl, { signal: controller.signal })
    .then(res => res.json())
    .catch(error => console.error(`Error fetching ${fetchUrl}\n${error}`))
    .then(([commit]) => commit == null ? null : commit.sha);
};

// adding a `commit` parameter here preliminarily in hopes of one day (soon 🤞🏼) supporting deep linking to a specific commit
const createLink = (repo, sha, commit = '') => {
  return `<li class="Box-row Box-row--hover-gray p-3 mt-0 rounded-0 ${dropdownLinkClass}">
    <a target="_blank" href="gitkraken://repolink/${sha}${commit ? `/commit/${commit}` : ''}?url=${repo}" class="d-flex flex-items-center color-fg-default text-bold no-underline">
      ${getGkLogo({ className: 'mr-2' })} Open in GitKraken
    </a>
  </li>`
};

initializePushstateEvent();
render();
window.addEventListener('pushstate', render);

const getGitUrl = () => (document.querySelector('meta[name="go-import"]') as HTMLMetaElement)?.content.split(' ')[2] ?? window.location.href ?? '';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.subject !== 'request-git-url') return;
  sendResponse(encodeURIComponent(getGitUrl()));
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.subject !== 'console-log') return;
  if (message?.payload) console.log(...message.payload);
});
