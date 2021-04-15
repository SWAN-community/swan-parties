const core = require('@actions/core');
const github = require('@actions/github');
const url = require('url');

// get inputs
const token = core.getInput('github-token', {required: true});
const fileName = core.getInput('file-path', {required: true});

const additions = core.getInput('additions');
const deletions = core.getInput('deletions');
const changes = core.getInput('changes');

// get authenticated octokit 
const octokit = github.getOctokit(token);

// regex for testing domain names.
const domainRegEx = /^(?!:\/\/)(?=.{1,255}$)((.{1,63}\.){1,127}(?![0-9]*$)[a-z0-9-]+\.?)$/;

// process a pull request for a given repo
async function processPullRequest(owner, repo, number) {
    // get the files that have changed in the pull request
    var files = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}/files', {
        owner: owner,
        repo: repo,
        pull_number: number
    });

    var domain = '';

    // check that only one file has changed.
    if (files.data && files.data.length == 1) {
        var file = files.data[0];
        // check that the file is the correct file and that only one line has 
        // been added.
        if (file.filename == fileName &&
            file.status == "modified" &&
            file.additions == additions &&
            file.deletions == deletions &&
            file.changes == changes) {
                // get commit ref
                var ref = new URL(file.contents_url).searchParams.get('ref');
                // get the contents of the file.
                var contents = await octokit.request('GET /repos/{owner}/{repo}/contents/{file}', {
                    owner: owner,
                    repo: repo,
                    file: fileName,
                    ref: ref
                }).then(result => {
                    return Buffer.from(result.data.content, result.data.encoding).toString();
                });

                // get last non-blank line and set as domain.
                var lines = contents.split('\n');
                var line = -1;
                while (domain == '') {
                    domain = lines[lines.length + line];
                    line--;
                }

                // check that domain is valid.
                if (!domain || !domainRegEx.test(domain)) {
                    throw `Domain ${domain} is not valid`;
                }
        } else {
            return {
                'merged': false,
                'message': 'Did not meet requirements for auto merge.'
            }
        }
    } else {
        return {
            'merged': false,
            'message': 'Too many files changed.'
        }
    }
    
    // merge the pull request.
    var res = await octokit.request('PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge', {
        owner: owner,
        repo: repo,
        pull_number: number,
        commit_title: `Added ${domain} to the list of domains.`
    })

    return res;
}

async function run() {
    try {
        console.log(`Event: ${github.context.eventName}`);
        
        // get the repo info from the event context.
        const repo = github.context.repo;

        // if this was not triggered by a PR then check all open PRs.
        if (github.context.eventName != 'pull_request') {
            var pulls = await github.request('GET /repos/{owner}/{repo}/pulls', repo);
            if (pulls.data) {
                for (var pull of pulls.data) {
                    var result = await processPullRequest(repo.owner, repo.repo, pull.number);
                    if (!result.data.merged) {
                        console.log(`PR ${pull.number} not merged. Message: ${result.data.message}`);
                    }
                }
            }
        } else {
            // get the pr number from the event context and process.
            var pull_number = github.context.payload.pull_request.number;
            var result = await processPullRequest(repo.owner, repo.repo, pull_number);
            if (!result.data.merged) {
                console.log(`PR ${pull_number} not merged. Message: ${result.data.message}`);
            }
        }
    } catch (error) {
        const payload = JSON.stringify(github.context.payload, undefined, 2)
        console.log(`The event payload: ${payload}`);
        core.setFailed(error.message);
    }
}

run();