const button = document.getElementById('search-button');
const repoInput = document.getElementById('repo-input')

const fetchRepo = async () => {
    try {
        const languageInput = repoInput.value.trim();
        const placeholder = document.getElementById('placeholder');
        const repoOutput = document.getElementById('repo-output');

        const apiUrl = `https://api.github.com/search/repositories?q=language:${languageInput}`;
        const res = await fetch(apiUrl, {
            headers: {
                'Accept': 'application/vnd.github.+json'
            }
        });

        if (!res.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await res.json();

        // Log entire data for debugging
        console.log(data);
        const i = Math.round(Math.random() * (data.items.length - 1));
        console.log(data.items[i]);

        const container = document.getElementById('repo-output');

        const mapping = {
            '#repo-name': data.items[i].name,
            '#repo-desc': data.items[i].description,
            '#repo-lang': languageInput,
            '#repo-stars': data.items[i].stargazers_count,
            '#repo-forks': data.items[i].forks_count,
            '#repo-watch': data.items[i].watchers_count,
        };

        Object.entries(mapping).forEach(([selector, value]) => {
            container.querySelector(selector).textContent = value;
        });

        const repoLink = document.getElementById('repo-link');
        repoLink.href = data.items[i].html_url;

        // Hide placeholder and show repo output
        placeholder.classList.add('hidden');
        repoOutput.classList.remove('hidden');

    } catch (error) {
        console.error('Error fetching repository data:', error);
    }
}

button.addEventListener('click', fetchRepo);

repoInput.addEventListener("keypress", event => {
  if (event.key === "Enter") {
    fetchRepo();
  }
});

