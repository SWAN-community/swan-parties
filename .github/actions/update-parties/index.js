const core = require('@actions/core');
const github = require('@actions/github');
const fetch = require('node-fetch');

const readline = require('readline');
const fs = require('fs');

try {
    // `source-file` and `out-file` input defined in action metadata file.
    const sourceFile = core.getInput('source-file');
    const outFile = core.getInput('out-file');

    const readInterface = readline.createInterface({
        input: fs.createReadStream(sourceFile),
        output: process.stdout,
        console: false
    });

    var fetches = [];
    readInterface.on('line', function(line) {
        var domain = line;
        if (domain.search(/^https?:\/\//) == -1){
            domain = 'https://' + domain;
        }

        fetches.push(
            fetch(domain + '/owid/api/v2/creator')
            .then(res => res.json())
            );
    });

    readInterface.on('close', function() {
        Promise.all(fetches).then(creators => {
            let data = JSON.stringify(creators, null, '\t');
            fs.writeFileSync(outFile, data);
        });
    });
} catch (error) {
    // core.setFailed(error.message);
}

