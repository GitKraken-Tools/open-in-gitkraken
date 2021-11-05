$( document ).ready(function() {
    render();
});

async function render() {
    const modal = $("div").find(`[data-target='get-repo.modal']`).find('ul');
    const repoUrl = modal.find(' > li:first-of-type input[data-autoselect]')[0].value;
    const user = repoUrl.split('/')[3];
    const repo = repoUrl.split('/')[4].replace('.git', '');
    const sha = await fetch(user, repo);
    if (sha) { modal.find(' > li:nth-last-child(1)').before(link(repoUrl, sha)); }
}

const link = (repo, sha) => {
    return `<li class="Box-row Box-row--hover-gray p-3 mt-0 rounded-0"> \
        <a target="_blank" href="gitkraken://repolink/${sha}?url=${repo}" class="d-flex flex-items-center color-text-primary text-bold no-underline"> \
            <img style="margin-right: 5px;" width="18" height="18" src="${chrome.extension.getURL('assets/keif-dark.png')}"> \
            Open in GitKraken \
        </a> \
    </li>`
}

