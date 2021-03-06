# Update Parties javascript action

This action takes a list of domains in the form of a new line separated text file, 
checks that each domain has the OWID well-known endpoint implemented and writes
the results to a json file.

The action queries the `/owid/api/v2/creator` endpoint for each domain and then 
writes the responses as an array to a json file. 

## Inputs

### `sourceFile`

**Required** The source file text file containing the new line separated domains.
Default `parties-domains.txt`

### `outFile`

The output json file containing the responses from each of the domains. Default 
`parties-domains.json`

## Example usage

```yaml
- name:
  id: update-parties
  uses: ./.github/actions/update-parties
  with: 
    source-file: '$GITHUB_WORKSPACE/parties-domains.txt'
    out-file: '$GITHUB_WORKSPACE/parties-domains.json'
```

## Updating the action

Install `vercel/ncc` by running this command in your terminal. `npm i -g @vercel/ncc`

Navigate to the action directory `cd ./.github/actions/update-parties`


Compile the `index.js` file. `ncc build index.js`

The `dist/index.js` file with the code and the compiled modules will be created or modified.

Commit the updates to `action.yml`, `index.js`, `dist/index.js`, and `node_modules` files.
