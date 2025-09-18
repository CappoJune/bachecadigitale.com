// Questo file gestisce la logica frontend per la bacheca

// Variabili globali
let posts = [];
let darkMode = false;

// Funzione per caricare i post dalla API
async function loadPosts() {
    try {
        const response = await fetch('/api/posts');
        posts = await response.json();
        displayPosts(posts);
        populateTagFilter();
    } catch (error) {
        console.error('Errore nel caricamento dei post:', error);
    }
}

// Funzione per visualizzare i post nel feed
function displayPosts(postsToShow) {
    const feed = document.getElementById('postsFeed');
    feed.innerHTML = '';
    postsToShow.forEach(post => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
        postCard.innerHTML = `
            <h3>${post.title || 'Senza titolo'}</h3>
            <div class="post-meta">Da: ${post.nickname || 'Anonimo'} - ${new Date(post.created_at).toLocaleString('it-IT')}</div>
            <p>${post.content}</p>
            ${post.image ? `<img src="uploads/${post.image}" alt="Immagine post">` : ''}
            <div class="post-tags">${post.tags ? 'Tag: ' + post.tags : ''}</div>
            <div class="post-actions">
                <button onclick="likePost(${post.id})">Mi piace (${post.likes})</button>
                <button onclick="reportPost(${post.id})">Segnala</button>
            </div>
        `;
        feed.appendChild(postCard);
    });
}

// Funzione per popolare il filtro tag
function populateTagFilter() {
    const tagFilter = document.getElementById('tagFilter');
    const allTags = new Set();
    posts.forEach(post => {
        if (post.tags) {
            post.tags.split(',').forEach(tag => allTags.add(tag.trim()));
        }
    });
    tagFilter.innerHTML = '<option value="">Filtra per tag</option>';
    allTags.forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        tagFilter.appendChild(option);
    });
}

// Funzione per pubblicare un nuovo post
async function submitPost(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    if (parseInt(formData.get('captcha')) !== 5) {
        alert('Risposta captcha errata. Riprova.');
        return;
    }
    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            body: formData
        });
        if (response.ok) {
            alert('Post pubblicato con successo!');
            event.target.reset();
            loadPosts();
        } else {
            alert('Errore nella pubblicazione del post.');
        }
    } catch (error) {
        console.error('Errore nella pubblicazione:', error);
    }
}

// Funzione per mettere "Mi piace" a un post
async function likePost(postId) {
    try {
        await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
        loadPosts();
    } catch (error) {
        console.error('Errore nel like:', error);
    }
}

// Funzione per segnalare un post
async function reportPost(postId) {
    try {
        await fetch(`/api/posts/${postId}/report`, { method: 'POST' });
        alert('Post segnalato.');
    } catch (error) {
        console.error('Errore nella segnalazione:', error);
    }
}

// Funzione per cercare e filtrare post
function filterPosts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedTag = document.getElementById('tagFilter').value;
    const filteredPosts = posts.filter(post => {
        const matchesSearch = !searchTerm || post.content.toLowerCase().includes(searchTerm) || (post.title && post.title.toLowerCase().includes(searchTerm));
        const matchesTag = !selectedTag || (post.tags && post.tags.includes(selectedTag));
        return matchesSearch && matchesTag;
    });
    displayPosts(filteredPosts);
}

// Funzione per toggle modalità scura/chiara
function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
    const button = document.getElementById('darkModeToggle');
    button.textContent = darkMode ? 'Modalità Chiara' : 'Modalità Scura';
    localStorage.setItem('darkMode', darkMode);
}

// Inizializzazione al caricamento della pagina
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    document.getElementById('newPostForm').addEventListener('submit', submitPost);
    document.getElementById('searchInput').addEventListener('input', filterPosts);
    document.getElementById('tagFilter').addEventListener('change', filterPosts);
    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);

    // Ripristina modalità scura se salvata
    darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeToggle').textContent = 'Modalità Chiara';
    }
});
