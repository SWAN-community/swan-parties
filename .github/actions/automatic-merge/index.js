const core = require('@actions/core');
const github = require('@actions/github');

const token = core.getInput('github-token', {required: true});
const fileName = core.getInput('file-path', {required: true});

const additions = core.getInput('additions');
const deletions = core.getInput('deletions');
const changes = core.getInput('changes');

const octokit = github.getOctokit(token);

const domainRegEx = /^(?!:\/\/)(?=.{1,255}$)((.{1,63}\.){1,127}(?![0-9]*$)[a-z0-9-]+\.?)$/;

async function processPullRequest(owner, repo, number){
    var pull = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
        owner: owner,
        repo: repo,
        pull_number: number
    });

    var files = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/files', {
        owner: owner,
        repo: repo,
        pull_number: number
    });

    var domain = "";

    if (files.length == 1) {
        var file = files[0];
        if (file.filename == fileName &&
            file.status == "modified" &&
            file.additions == additions &&
            file.deletions == deletions &&
            file.changes == changes) {
                var contents = await fetch(file.contents_url).then(res = res.txt());

                domain = contents.substring(contents.lastIndexOf("\n"));

                var valid = domainRegEx.test(domain);
                if (!valid) return false;
        }
    } else {
        return false
    }

    if (!domain) {
        return false;
    }
    
    var res = await octokit.request('PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge', {
        owner: owner,
        repo: repo,
        pull_number: number,
        commit_title: `Added ${domain} to the list of domains.`
    })

    return res.merged && true;
}

async function run() {
    try {
        const repo = github.context.repo;

        if(github.context.eventName !== "pull_request") {
            var pulls = await github.request('GET /repos/{owner}/{repo}/pulls', repo);
            pulls.forEach(element => {
            processPullRequest(repo.owner, repo.repo, element.number) ;
            });
        } else {
            var pull_number = github.context.payload.pull_request.number;
            processPullRequest(repo.owner, repo.repo, pull_number);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();