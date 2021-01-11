import API from './api.js';
import { showFeed } from './post.js';
import { displayUserProfile } from './profile.js';
import { popupModal } from './helpers.js';

const api = new API('http://localhost:5000');
const token = localStorage.getItem('token');
console.log(token)
const profileContainer = document.getElementById('profile-container'),
    feedContainer = document.getElementById('feed-container'),
    newPostContainer = document.getElementById('new-post-container'),
    feedBtn = document.getElementById('feed-btn'),
    newPostBtn = document.getElementById('new-post-btn'),
    profileBtn = document.getElementById('profile-btn'),
    logoutBtn = document.getElementById('logout-btn');


/* Check user login status */
if (localStorage.getItem('token')) {
    feedContainer.querySelectorAll('*').forEach(n => n.remove());
    api.getFeed(localStorage.getItem('token'))
        .then(feedJSON => feedJSON.posts.forEach(element => showFeed(element)));
    login.style.display = 'none';
    feedContainer.style.display = 'block';
} else {
    login.style.display = 'block';
}

feedBtn.addEventListener('click', event => {
    if (!localStorage.getItem('token')) {
        feedContainer.style.display = 'none';
        profileContainer.style.display = 'none';
        newPostContainer.style.display = 'none';
        login.style.display = 'block';
        signup.style.display = 'none';
    } else {
        feedContainer.style.display = 'block';
        profileContainer.style.display = 'none';
        newPostContainer.style.display = 'none';
    }
});

newPostBtn.addEventListener('click', event => {
    if (!localStorage.getItem('token')) popupModal('Login Error', 'You have not logged in!');
    else {
        profileContainer.style.display = 'none';
        feedContainer.style.display = 'none';
        newPostContainer.style.display = 'block';
    }
});
/**
 * Display logged in user's profile
 */
profileBtn.addEventListener('click', event => {
    if (!localStorage.getItem('token')) popupModal('Login Error', 'You have not logged in!');
    else {

        api.getLoggedInUser(localStorage.getItem('token'))
            .then(user => {
                feedContainer.style.display = 'none';
                profileContainer.style.display = 'block';
                newPostContainer.style.display = 'none';
                displayUserProfile(user);
            });
    }
});

logoutBtn.addEventListener('click', event => {
    localStorage.removeItem('token');
    login.style.display = 'block';
    signup.style.display = 'none';
    profileContainer.style.display = 'none';
    feedContainer.style.display = 'none';
    newPostContainer.style.display = 'none';
});


/* Display signup form */
document.getElementById('sign-up-btn')
    .addEventListener('click', event => {
        login.style.display = 'none';
        signup.style.display = 'block';
    })

/**
 * Process Login 
 */
login.addEventListener('submit', event => {
    event.preventDefault();

    // Get input values
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    // POST request
    api.post('auth/login', {
            "username": username,
            "password": password
        })
        .then(res => {
            console.log(res);
            if (res.status === 200) {
                res.json().then(token => {
                    localStorage.setItem('token', token.token);
                    login.style.display = 'none';
                    feedContainer.style.display = 'block';
                    /*********  SHOW FEED **********/
                    feedContainer.querySelectorAll('*').forEach(n => n.remove());
                    api.getFeed(token.token)
                        .then(feedJSON => feedJSON.posts.forEach(element => showFeed(element)));
                })
            } else {
                res.json()
                    .then(err => {
                        if (err.message !== undefined) {
                            console.log(err.message);
                            popupModal('Login Error', err.message);
                        }
                    });
            }
        })
        .catch(err => console.warn(`API_ERROR: ${err.message}`));
});

/**
 * Process Sign up
 */
signup.addEventListener('submit', event => {
    event.preventDefault();

    // Get input content
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    const confirmed = document.getElementById('signup-confirm-password').value;
    const email = document.getElementById('signup-email').value;
    const name = document.getElementById('signup-name').value;

    // Match password
    if (password !== confirmed) {
        popupModal('Sign up Error', 'Passwords not match!')
    }

    // Send post
    const user = {
        "username": username,
        "password": password,
        "email": email,
        "name": name
    }

    api.post('auth/signup', user)
        .then(res => {
            console.log(res);
            if (res.status === 200) {
                res.json()
                    .then(token => {
                        console.log('token', token);
                        localStorage.setItem('token', token.token);
                        signup.style.display = 'none';
                        /*********  SHOW FEED **********/
                        feedContainer.querySelectorAll('*').forEach(n => n.remove());
                        api.getFeed(token.token)
                            .then(feedJSON => feedJSON.posts
                                .forEach(element => showFeed(element)));
                    })
            } else {
                res.json()
                    .then(err => {
                        if (err.message !== undefined) {
                            console.log(err.message);
                            popupModal('Sign Up Error', err.message);
                        }
                    });
            }

        })
        .catch(err => console.warn(`API_ERROR: ${err.message}`));
});

export { token };