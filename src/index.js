const render = async () => {
    const modal = document.querySelector('div [data-target="get-repo.modal"] ul'); // The clone dropdown element
    const repoUrl = Array.from(modal.children).find(elem => elem.matches('li:first-of-type')).querySelector('input[data-autoselect]').value; // The copy link
    const user = repoUrl.split('/')[3]; // Extract the user from the link
    const repo = repoUrl.split('/')[4].replace('.git', ''); // Extract the repo name from the link
    const numCommits = document.querySelector('svg.octicon-history').nextElementSibling.querySelector('strong').textContent().replace(',', ''); // Extract the number of commits in the repo
    const sha = await getFirstCommit(user, repo, numCommits); // Fetch the first commit
    if (sha) { Array.from(modal.children).findLast(elem => elem.matches('li:nth-last-child(1)')).insertAdjacentHTML('beforebegin', createLink(repoUrl, sha)); } // Show the button if the commit was found
};

const getFirstCommit = async (user, repo, numCommits) => {
    if (numCommits === 0) { return null; }
    return await fetch(`https://api.github.com/repos/${user}/${repo}/commits?per_page=1&page=${numCommits}`)
        .catch(e => null)
        .then(res => res.json())
        .then(([commit]) => commit == null ? null : commit.sha);
};

// adding a `commit` parameter here preliminarily in hopes of one day (soon 🤞🏼) supporting deep linking to a specific commit
const createLink = (repo, sha, commit = '') => {
    return `<li class="Box-row Box-row--hover-gray p-3 mt-0 rounded-0">
        <a target="_blank" href="gitkraken://repolink/${sha}${commit ? `/commit/${commit}` : ''}?url=${repo}" class="d-flex flex-items-center color-fg-default text-bold no-underline">
            <img style="margin-right: 5px;" width="18" height="18" src="${chrome.runtime.getURL('assets/keif-dark.png')}">
            Open in GitKraken
        </a>
    </li>`
};

render();