const newsFeed = document.querySelector('.news-feed');
const footer = document.querySelector('footer');

// API details (replace with your API key and endpoint)
const API_URL = 'https://newsapi.org/v2/top-headlines';
const API_KEY = 'cb0955acf13c402ab2184468adf86ca2'; // Replace with your key
const COUNTRY = 'us'; // Change to your preferred country
const PAGE_SIZE = 5; // Number of articles per request
let page = 1; // Current page for API request
let loading = false; // Prevent redundant API calls

// Fetch news data from the API
async function fetchNews() {
    if (loading) return; // Prevent multiple calls
    loading = true;

    footer.style.display = 'block'; // Show loading message
    footer.textContent = 'Loading...'; // Display a loading indicator

    const url = `${API_URL}?country=${COUNTRY}&pageSize=${PAGE_SIZE}&page=${page}&apiKey=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.articles && data.articles.length > 0) {
            renderNews(data.articles);
            page++; // Increment the page for the next request
        } else {
            footer.textContent = 'No more news to load.';
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        footer.textContent = 'Failed to load news. Please try again later.';
    } finally {
        loading = false; // Reset the loading state
        setTimeout(() => (footer.style.display = 'none'), 1000); // Hide loading message after a short delay
    }
}

// Render news articles to the page
function renderNews(articles) {
    articles.forEach(article => {
        const post = document.createElement('div');
        post.classList.add('post');
        post.innerHTML = `
            <img src="${article.urlToImage || 'placeholder.jpg'}" alt="${article.title || 'News Image'}">
            <div class="post-content">
                <h2>${article.title || 'No Title Available'}</h2>
                <p>${article.description || 'No description available.'}</p>
                <a href="${article.url}" target="_blank">Read more</a>
                <div class="post-actions">
                    <button class="like-button">Like 👍(<span class="like-count">0</span>)</button>
                    <button class="dislike-button">Dislike 👎 (<span class="dislike-count">0</span>)</button>
                    <button class="share-button">Share ↗️</button>
                    <button class="comment-button">Report 🔴 </button>
                </div>
                <div class="comments-section">
                    <input type="text" class="comment-input" placeholder="Add a comment...">
                    <button class="add-comment-button">Post</button>
                    <ul class="comments-list"></ul>
                </div>
            </div>
        `;

        // Add event listeners for the buttons
        const likeButton = post.querySelector('.like-button');
        const dislikeButton = post.querySelector('.dislike-button');
        const shareButton = post.querySelector('.share-button');
        const commentButton = post.querySelector('.comment-button');
        const addCommentButton = post.querySelector('.add-comment-button');
        const commentInput = post.querySelector('.comment-input');
        const commentsList = post.querySelector('.comments-list');

        likeButton.addEventListener('click', () => {
            const likeCount = likeButton.querySelector('.like-count');
            likeCount.textContent = parseInt(likeCount.textContent) + 1;
        });

        dislikeButton.addEventListener('click', () => {
            const dislikeCount = dislikeButton.querySelector('.dislike-count');
            dislikeCount.textContent = parseInt(dislikeCount.textContent) + 1;
        });

        shareButton.addEventListener('click', () => {
            alert('Share functionality is not implemented yet.');
        });

        addCommentButton.addEventListener('click', () => {
            const commentText = commentInput.value.trim();
            if (commentText) {
                const comment = document.createElement('li');
                comment.textContent = commentText;
                commentsList.appendChild(comment);
                commentInput.value = '';
            }
        });

        newsFeed.appendChild(post);
    });

}

// Infinite scrolling
window.addEventListener('scroll', () => {
    if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 50
    ) {
        fetchNews();
    }
});

// Initial fetch
fetchNews();
