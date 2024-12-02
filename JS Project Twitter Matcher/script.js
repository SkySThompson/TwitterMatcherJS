let users = [];
const apiLimit = 17; // Twitter free plan: 17 requests/day

document.getElementById('userForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();
    if (username && !users.includes(username)) {
        users.push(username);
        updateUserList();
        document.getElementById('analyzeBtn').disabled = users.length < 2;
    } else if (users.includes(username)) {
        alert('This user is already added.');
    }
    usernameInput.value = '';
});

document.getElementById('analyzeBtn').addEventListener('click', analyzeVibes);

document.getElementById('resetBtn').addEventListener('click', resetData);

function updateUserList() {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    users.forEach((user, index) => {
        const li = document.createElement('li');
        li.textContent = user;
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.style.marginLeft = '10px';
        removeBtn.addEventListener('click', () => {
            users.splice(index, 1);
            updateUserList();
            document.getElementById('analyzeBtn').disabled = users.length < 2;
        });
        li.appendChild(removeBtn);
        userList.appendChild(li);
    });
}

async function analyzeVibes() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<p>Analyzing...</p>';

    try {
        const themes = {};
        const userTweets = {};

        for (const user of users) {
            // Fake API call placeholder
            const tweets = await fetchUserTweets(user);
            userTweets[user] = tweets; // Save the tweets for display

            const keywords = extractKeywords(tweets);

            keywords.forEach((keyword) => {
                if (!themes[keyword]) themes[keyword] = [];
                themes[keyword].push(user);
            });
        }

        displayResults(themes, userTweets);
    } catch (error) {
        resultsDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

// Mock function for fetching tweets (can be replaced with Twitter API $120 monthly though)
async function fetchUserTweets(username) {
    return new Promise((resolve) =>
        setTimeout(() => resolve([
            `${username}'s favorite game is Minecraft.`,
            `${username} loves coding in Python.`,
            `${username} recently visited the mountains.`,
        ]), 500)
    );
}

// Keyword extractor
function extractKeywords(tweets) {
    const words = tweets.join(' ').toLowerCase().split(/\W+/);
    const commonWords = ['the', 'is', 'in', 'and', 'of', 'to', 'a', 'loves', 'recently', 'favorite'];
    return words.filter((word) => word.length > 3 && !commonWords.includes(word));
}

// Display shared themes and user tweets
function displayResults(themes, userTweets) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<h3>Team Vibes:</h3>';
    const ul = document.createElement('ul');

    // Display shared themes
    Object.entries(themes).forEach(([keyword, users]) => {
        if (users.length > 1) {
            const li = document.createElement('li');
            li.textContent = `${keyword}: Shared by ${users.join(', ')}`;
            ul.appendChild(li);
        }
    });

    resultsDiv.appendChild(ul);

    // Display individual user tweets
    const userTweetsDiv = document.createElement('div');
    userTweetsDiv.innerHTML = '<h3>User Tweets:</h3>';

    users.forEach((user) => {
        const userDiv = document.createElement('div');
        const userTitle = document.createElement('h4');
        userTitle.textContent = `${user}'s Tweets:`;

        const userTweetsList = document.createElement('ul');
        userTweets[user].forEach((tweet) => {
            const tweetLi = document.createElement('li');
            tweetLi.textContent = tweet;
            userTweetsList.appendChild(tweetLi);
        });

        userDiv.appendChild(userTitle);
        userDiv.appendChild(userTweetsList);
        userTweetsDiv.appendChild(userDiv);
    });

    resultsDiv.appendChild(userTweetsDiv);
}

// Sentiment analysis mock function
function analyzeSentiment(tweets) {
    // A placeholder for a sentiment analysis tool (you can integrate an API)
    return tweets.map(tweet => {
        const sentiment = Math.random() > 0.5 ? 'Positive' : 'Negative'; // Random sentiment for the mock
        return { tweet, sentiment };
    });
}

function resetData() {
    users = [];
    updateUserList();
    document.getElementById('results').innerHTML = '';
    document.getElementById('analyzeBtn').disabled = true;
}
