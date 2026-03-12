async function getRepos(language) {
    const apiUrl = `https://api.github.com/search/repositories?q=language:${language}`;

    const res = await fetch(apiUrl, {
        headers: {
            'Accept': 'application/vnd.github.+json'
        }
    });

    if (!res.ok) {
        throw new Error('Network response was not ok');
    }

    const data = await res.json();
    return data;
}

module.exports = { getRepos };