# ![Secured Web Addressability Network](https://raw.githubusercontent.com/SWAN-community/swan/main/images/swan.128.pxls.100.dpi.png)

# Secured Web Addressability Network (SWAN) Parties
A list of the parties that have agreed to the [SWAN Model Terms](https://github.com/SWAN-community/swan/blob/main/model-terms.md). 

See a list of all organizations that have the OWID well-known endpoint implemented on [GitHub Pages]( https://swan-community.github.io/swan-parties).

## Files

* `parties-domains.txt` - A list of domains that have agreed to the SWAN Model 
  Terms.
* `parties-domains.json` - A JSON array containing the responses of the OWID 
  well-known endpoint for each of the domains in `parties-domains.txt`
* `parties-domains-last-changed.txt` - The date and time the `parties-domains.json`
  file was last updated.
* `index.html` - A webpage to display all the parties domains that have the OWID
  well-known endpoint implemented.

## Adding a parties' domain

To add a domain, edit the `parties-domains.txt` file and add a new domain on a new
line at the bottom of the file.

When adding a domain:

* Edit the `parties-domains.txt` file using the GitHub UI and propose changes.

* Only add one domain per line, prefix with `http://` or `https://` otherwise defaults to `https://`

* Leave no trailing slash.
