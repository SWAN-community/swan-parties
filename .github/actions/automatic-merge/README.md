# Automatic Merge javascript action

This action will automatically merge a pull request if it conforms to the 
following:

* Is a change to the specified file: e.g. `parties-domains.txt`.
* Has single addition.
* Has no deletions.
* Has a single change.
* The addition is a single line which is a valid FQDN.

## Inputs

### `file-path`

**Required** The path of the file to check. Default `parties-domains.txt`

### `github-token`

**Required** Github secret token.

### `additions`

The number of additions required in the PR. Default: 1

### `deletions`

The number of deletions required in the PR. Default: 0

### `changes:`

The number of changes required in the PR. Default: 1

## Example usage

```yaml
- name: Auto merge
  id: auto-merge
  uses: ./.github/actions/automatic-merge
  with: 
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Updating the action

Install `vercel/ncc` by running this command in your terminal. `npm i -g @vercel/ncc`

Navigate to the action directory `cd ./.github/actions/automatic-merge`

Compile the `index.js` file. `ncc build index.js`

The `dist/index.js` file with the code and the compiled modules will be created or modified.

From the terminal, commit the updates to `action.yml`, `index.js`, `dist/index.js`, and `node_modules` files.
