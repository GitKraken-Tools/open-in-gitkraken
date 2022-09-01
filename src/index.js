$( document ).ready(function() {
    render();
});

const render = async () => {
    const modal = $("div").find(`[data-target='get-repo.modal']`).find('ul'); // The clone dropdown element
    const repoUrl = modal.find(' > li:first-of-type input[data-autoselect]')[0].value; // The copy link
    const user = repoUrl.split('/')[3]; // Extract the user from the link
    const repo = repoUrl.split('/')[4].replace('.git', ''); // Extract the repo name from the link
    const numCommits = $("svg.octicon-history").next().find('strong').text().replace(',', ''); // Extract the number of commits in the repo
    const sha = await fetch(user, repo, numCommits); // Fetch the first commit
    if (sha) { modal.find(' > li:nth-last-child(1)').before(createLink(repoUrl, sha)); } // Show the button if the commit was found
}

const fetch = async (user, repo, numCommits) => {
    const commits = await axios(`https://api.github.com/repos/${user}/${repo}/commits?per_page=1&page=${numCommits}`).then(i => i.data);
    if (commits.length === 0) { return null; }
    return commits[commits.length - 1].sha || null;
}

const createLink = (repo, sha) => {
    return `<li class="Box-row Box-row--hover-gray p-3 mt-0 rounded-0"> \
        <a target="_blank" href="gitkraken://repolink/${sha}?url=${repo}" class="d-flex flex-items-center color-fg-default text-bold no-underline"> \
            <img style="margin-right: 5px;" width="18" height="18" src="${chrome.runtime.getURL('assets/keif-dark.png')}"> \
            Open in GitKraken \
        </a> \
    </li>`
}

