const button = document.getElementById('search-button');
const repoInput = document.getElementById('repo-input')
const refreshButton = document.getElementById('refresh');
const placeholder = document.getElementById('placeholder');
const repoContainer = document.getElementById('repo-container');
const repoOutput = document.getElementById('repo-output');
const results = document.getElementById('results');

let languages = [];

// Fetch JSON once on page load
async function loadLanguages() {
    try {
        const res = await fetch('https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json');
        const data = await res.json();
        // Extract only the 'value' strings and filter out empty ones
        languages = data
            .map(item => item.value)
            .filter(v => v); // remove empty strings
    } catch (error) {
        console.error('Error loading languages:', error);
    }
}

// Call it immediately to populate languages array
loadLanguages();

// Listen for input changes
repoInput.addEventListener('input', () => {
    const value = repoInput.value.toLowerCase().trim();
    // Clear previous results
    results.innerHTML = '';

    if (!value) {
        results.classList.add('hidden');
        return;
    }

    // Filter suggestions
    const filtered = languages.filter(lang => lang.toLowerCase().startsWith(value)).slice(0, 5); // show top 10

    if (filtered.length === 0) {
        results.classList.add('hidden');
        return;
    }

    // Show results
    filtered.forEach(lang => {
        const p = document.createElement('p');
        p.textContent = lang;
        p.classList.add('result-item'); // optional styling class
        // Click to autofill input
        p.addEventListener('click', () => {
            repoInput.value = lang;
            results.classList.add('hidden');
        });
        results.appendChild(p);
    });

    results.classList.remove('hidden');
});

const fetchRepo = async () => {
    try {
        const languageInput = repoInput.value.trim();
        
        const start = Date.now();
        const minTime = 500;

        repoOutput.classList.add('hidden');
        refreshButton.classList.add('hidden');
        
        repoContainer.style.backgroundColor = '#eeeeee';
        placeholder.classList.remove('hidden');
        placeholder.textContent = "Loading...";

        // Fetch repositories from GitHub API based on the input language
        const serverUrl = `http://127.0.0.1:3000/repos?language=${languageInput}`;
        const res = await fetch(serverUrl);

        if (!res.ok) {
            const elapsed = Date.now() - start;

            if (elapsed < minTime) {
                await new Promise(resolve => setTimeout(resolve, minTime - elapsed));
            }

            // Show error state
            repoContainer.style.backgroundColor = '#fcadad';
            placeholder.textContent = "Error fetching repositories";

            // Update refresh button for retry
            refreshButton.textContent = "Click to retry";
            refreshButton.style.backgroundColor = '#d12e2e';

            refreshButton.classList.remove('hidden');
            
            throw new Error("Network response was not ok");
        }

        const data = await res.json();

        // Log entire data for debugging
        console.log(data);
        const i = Math.round(Math.random() * (data.items.length - 1));
        console.log(data.items[i]);

        // Map of selectors to their corresponding data values
        const mapping = {
            '#repo-name': data.items[i].name,
            '#repo-desc': data.items[i].description,
            '#repo-lang': data.items[i].language,
            '#repo-stars': data.items[i].stargazers_count,
            '#repo-forks': data.items[i].forks_count,
            '#repo-watch': data.items[i].watchers_count,
        };

        // Update the DOM elements with the fetched data
        Object.entries(mapping).forEach(([selector, value]) => {
            repoOutput.querySelector(selector).textContent = value;
        });

        const repoLink = document.getElementById('repo-link');
        repoLink.href = data.items[i].html_url;

        // Ensure the loading state is visible for at least 400ms
        const elapsed = Date.now() - start;

        if (elapsed < minTime) {
            await new Promise(resolve => setTimeout(resolve, minTime - elapsed));
        }

        // Update refresh button for retry
        refreshButton.textContent = "Refresh";
        refreshButton.style.backgroundColor = '#0d1117';

        // Hide placeholder and show repo output
        placeholder.classList.add('hidden');

        repoOutput.classList.remove('hidden');
        refreshButton.classList.remove('hidden');

    } catch (error) {
        // Show error state
        repoContainer.style.backgroundColor = '#fcadad';
        placeholder.textContent = "Error fetching repositories";

        // Update refresh button for retry
        refreshButton.textContent = "Click to retry";
        refreshButton.style.backgroundColor = '#d12e2e';

        refreshButton.classList.remove('hidden');

        console.error('Error fetching repository data:', error);
    }
}

// Add event listener to the search button and the input field for "Enter" key press
button.addEventListener('click', fetchRepo);

repoInput.addEventListener("keypress", event => {
  if (event.key === "Enter") {
    fetchRepo();
  }
});

refreshButton.addEventListener('click', fetchRepo);

