async function fetch(user, repo) {
    let firstCommit = null;
    const access = await axios(`https://api.github.com/repos/${user}/${repo}`).then(i => i.data);
    if (access) { firstCommit = access.source ? getCommits(access.source) : getCommits(access); }
    return firstCommit;
}

async function getCommits(repo) {
    const date = new Date(repo.created_at);
    const until = new Date(date.getTime() + 86400000);
    const since = new Date(date.getTime() - 86400000);
    const commits = await axios(`https://api.github.com/repos/${repo.full_name}/commits?since=${since.toISOString()}&until=${until.toISOString()}`).then(i => i.data);
    if (commits.length === 0) { return null; }
    return commits[commits.length - 1].sha;
}