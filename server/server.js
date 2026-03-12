const express = require('express');
const cors = require('cors');
const { getRepos } = require('./api');

require('dotenv').config();

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    optionsSuccessStatus: 200,
}));

app.get('/repos', async (req, res) => {
    const language = req.query.language;

    try {
        const data = await getRepos(language);
        res.json(data);

    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch repositories' });
    }
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});