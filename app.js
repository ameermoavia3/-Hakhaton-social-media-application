var currentUser = null;
var dashboard = document.querySelector(".dashboard");
var choiceBox = document.querySelector(".choice-box");
var postBtn = document.getElementById("postBtn");
var postText = document.getElementById("postText");
var postImage = document.getElementById("postImage");
var feed = document.getElementById("feed");
var sortSelect = document.getElementById("sortSelect");
var searchInput = document.getElementById("searchInput");
var logoutBtn = document.getElementById("logoutBtn");
var loggedUserSpan = document.getElementById("loggedUser");

var goSignup = document.getElementById("goSignup");
var goLogin = document.getElementById("goLogin");

goSignup.addEventListener("click", () => {
    choiceBox.style.display = "none";
    document.querySelector(".signup-box").style.display = "block";
});

goLogin.addEventListener("click", () => {
    choiceBox.style.display = "none";
    document.querySelector(".login-box").style.display = "block";
});

var showLoginLink = document.getElementById("showLogin");
var showSignupLink = document.getElementById("showSignup");

showLoginLink.addEventListener("click", e => {
    e.preventDefault();
    document.querySelector(".signup-box").style.display = "none";
    document.querySelector(".login-box").style.display = "block";
});

showSignupLink.addEventListener("click", e => {
    e.preventDefault();
    document.querySelector(".login-box").style.display = "none";
    document.querySelector(".signup-box").style.display = "block";
});


// ✅ SIGNUP — SAVE NAME + EMAIL + PASSWORD
var signupForm = document.getElementById("signupForm");
var msg = document.getElementById("msg");

signupForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var password = document.getElementById("password").value;

    if (!name || !email || !password) {
        msg.textContent = "All fields are must be filled";
        return;
    }

    var users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.find(u => u.email === email)) {
        msg.textContent = "Email is already exists!";
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    msg.textContent = "Signup successful!";
    signupForm.reset();

    document.querySelector(".signup-box").style.display = "none";
    document.querySelector(".login-box").style.display = "block";
});


// ✅ LOGIN — CHECK EMAIL, STORE USER NAME
var loginForm = document.getElementById("loginForm");
var loginMsg = document.getElementById("loginMsg");

loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    var email = document.getElementById("loginEmail").value.trim();
    var password = document.getElementById("loginPassword").value;

    var users = JSON.parse(localStorage.getItem("users") || "[]");
    var found = users.find(u => u.email === email && u.password === password);

    if (found) {

        currentUser = found.name;

        
        var posts = JSON.parse(localStorage.getItem("posts") || "[]");
        posts.forEach(p => {
            
            var posts = JSON.parse(localStorage.getItem("posts") || "[]");
            posts.forEach(p => {
                if (p.username.trim() === found.email.trim()) {
                    p.username = found.name;
                }
            });
            localStorage.setItem("posts", JSON.stringify(posts));
            
            {
                p.username = found.name;
            }
        });
        localStorage.setItem("posts", JSON.stringify(posts));
    

        choiceBox.style.display = "none";
        document.querySelector(".login-box").style.display = "none";
        dashboard.style.display = "block";

        loggedUserSpan.textContent = currentUser;
        renderFeed();

    } else {
        loginMsg.textContent = "Email and  password are incorrect !";
    }
});



// LOGOUT
logoutBtn.addEventListener("click", () => {
    currentUser = null;
    dashboard.style.display = "none";
    choiceBox.style.display = "block";
});


// CREATE POST
postBtn.addEventListener("click", () => {
    var content = postText.value.trim();
    var image = postImage.value.trim();

    if (!content) return alert("Post cannot be empty!");

    var posts = JSON.parse(localStorage.getItem("posts") || "[]");

    var post = {
        id: Date.now(),
        username: currentUser, // <-- SHOW NAME
        content,
        imageUrl: image,
        likes: 0
    };

    posts.unshift(post);
    localStorage.setItem("posts", JSON.stringify(posts));

    postText.value = "";
    postImage.value = "";

    renderFeed();
});


// RENDER FEED
function renderFeed() {
    var posts = JSON.parse(localStorage.getItem("posts") || "[]");

    if (sortSelect.value === "oldest") posts = posts.reverse();
    else if (sortSelect.value === "mostLiked") posts = posts.sort((a, b) => b.likes - a.likes);

    var filterText = searchInput.value.toLowerCase();
    if (filterText) posts = posts.filter(p => p.content.toLowerCase().includes(filterText));

    feed.innerHTML = "";

    posts.forEach(post => {
        var div = document.createElement("div");
        div.className = "post-card";

        div.innerHTML = `
            <h5>${post.username}</h5>
            <p id="content-${post.id}">${post.content}</p>
            ${post.imageUrl ? `<img src="${post.imageUrl}" class="img-fluid mb-2">` : ''}

            <div class="post-actions">
                <button onclick="toggleLike(${post.id})">❤️ ${post.likes}</button>
                ${post.username === currentUser ?
                `<button onclick="editPost(${post.id})">✏️</button>
                 <button onclick="deletePost(${post.id})">🗑️</button>` : ``}
            </div>
        `;
        feed.appendChild(div);
    });
}


// LIKE
window.toggleLike = function (id) {
    var posts = JSON.parse(localStorage.getItem("posts") || "[]");
    posts.forEach(p => { if (p.id === id) p.likes = p.likes === 0 ? 1 : 0; });
    localStorage.setItem("posts", JSON.stringify(posts));
    renderFeed();
}


// DELETE POST
window.deletePost = function (id) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    var posts = JSON.parse(localStorage.getItem("posts") || "[]");
    posts = posts.filter(p => p.id !== id);

    localStorage.setItem("posts", JSON.stringify(posts));
    renderFeed();
}


// EDIT POST
window.editPost = function (id) {
    var posts = JSON.parse(localStorage.getItem("posts") || "[]");
    var post = posts.find(p => p.id === id);

    var newContent = prompt("Edit your post:", post.content);
    if (newContent !== null) {
        post.content = newContent;
        localStorage.setItem("posts", JSON.stringify(posts));
        renderFeed();
    }
}


// SEARCH AND SORT EVENTS
searchInput.addEventListener("input", renderFeed);
sortSelect.addEventListener("change", renderFeed);



// ============ THEME TOGGLE SYSTEM =============
const themeToggle = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️";
}

// Button Click
themeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggle.textContent = "🌙";
        localStorage.setItem("theme", "light");
    }
});
