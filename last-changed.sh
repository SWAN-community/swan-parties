if [ "$(git ls-files --modified | grep -c parties-domains.json)" -ge 1 ]; then 
    date > parties-domains-last-changed.txt
fi