import API from './api.js';
import { token } from './main.js';
import { showFeed } from './post.js';

// Global DOMs
const api = new API('http://localhost:5000'),
    profile = document.getElementById('profile-container'),
    followBtn = document.getElementById('follow-btn'),
    unfollowBtn = document.getElementById('unfollow-btn'),
    updateBtn = document.getElementById('update-profile-btn'),
    cancelBtn = document.getElementById('update-cancel-btn'),
    updateSubmitBtn = document.getElementById('update-confirm-btn'),
    updateName = document.getElementById('update-name'),
    updateEmail = document.getElementById('update-email'),
    updatePassword = document.getElementById('update-password'),
    followList = document.getElementById('following-list'),
    postContainer = document.getElementById('own-post-container'),
    profileUserName = document.getElementById('profile-username'),
    profileName = document.getElementById('profile-name'),
    profileEmail = document.getElementById('profile-email');
/**
 * 
 * Display a single user's information according to JSON object of user
 * by doing DOM manipulation to fill the profile
 * 
 * @param {json} user - the profiled user JSON
 * 
 */
export const displayUserProfile = (user) => {
    profileUserName.firstChild.nodeValue = `${user.username}`;
    profileName.firstChild.nodeValue = `Name: ${user.name}`;
    profileEmail.firstChild.nodeValue = `Email: ${user.email}`;

    // Display posts
    const posts = user.posts;
    postContainer.querySelectorAll('*').forEach(n => n.remove());
    posts.forEach(element => {
        api.getPostByID(localStorage.getItem('token'), element)
            .then(postJSON => {
                showFeed(postJSON, true); // Same as feed
            });
    });

    // Display follow counts
    document.getElementById('follower').firstChild.nodeValue = `Followers: ${user.followed_num}`;
    document.getElementById('following').firstChild.nodeValue = `Followings: ${user.following.length}`;

    // Toggle update form
    updateBtn.addEventListener('click', event => update.style.display = 'block');
    cancelBtn.addEventListener('click', event => update.style.display = 'none');
    updateName.value = user.name;
    updateEmail.value = user.email;
    updatePassword.value = user.password;
    update.addEventListener('submit', event => {
        event.preventDefault();
        updateProfile();
    });

    followBtn.style.display = 'none';
    unfollowBtn.style.display = 'none';
    updateBtn.style.display = 'none';

    /** Check if profiled user is followed by logged in user, 
     * if followed, display following list, and followed button change to unfollowed
     */
    api.getLoggedInUser(localStorage.getItem('token'))
        .then(loggedUser => {
            if (loggedUser.following.includes(user.id)) {
                unfollow(user.username);
                displayFollowList(user); // Display following list
            } else if (user.id === loggedUser.id) {
                updateBtn.style.display = 'block';
                displayFollowList(user); // Display following list
            } else {
                follow(user.username);
            }
        });

    // Display profile
    profile.style.display = 'block';
}

/**
 * Add event listner on follow button
 * Make follow request
 * @param {string} username
 */
const follow = (username) => {
    followBtn.style.display = 'block';
    unfollowBtn.style.display = 'none';
    followBtn.addEventListener('click', event => {
        api.follow(username, localStorage.getItem('token'));
        followBtn.style.display = 'none';
        unfollowBtn.style.display = 'block';
        unfollowBtn.addEventListener('click', event => {
            api.unfollow(username, localStorage.getItem('token'));
            followBtn.style.display = 'block';
            unfollowBtn.style.display = 'none';
        });
    });
}

/**
 * Add event listner on unfollow button
 * Make unfollow request
 * @param {string} username
 */
const unfollow = (username) => {
    followBtn.style.display = 'none';
    unfollowBtn.style.display = 'block';
    unfollowBtn.addEventListener('click', event => {
        api.unfollow(username, localStorage.getItem('token'));
        followBtn.style.display = 'block';
        unfollowBtn.style.display = 'none';
        followBtn.addEventListener('click', event => {
            api.follow(username, localStorage.getItem('token'));
            followBtn.style.display = 'none';
            unfollowBtn.style.display = 'block';
        });
    });
}

/**
 * 
 * DOM manipulation to add following list under user's information.
 * Will be display if is followed by logged user, otherwise display none.
 * List item is button which can be clicked to access corresponding 
 * user's profile page.
 * 
 * @param {json} user - the profiled user
 */
const displayFollowList = (user) => {
    followList.querySelectorAll('*').forEach(n => n.remove());
    const title = document.createElement('h3');
    title.id = 'following-title';
    followList.append(title);
    if (user.following.length > 0) { // If profiled user is following someone, display the list
        title.appendChild(document.createTextNode('Following'));
        // Make request to get following users' name by id
        user.following
            .forEach(id => api.getUserNameByID(localStorage.getItem('token'), id) // Fetch each following user's info
                .then(user => {
                    const button = document.createElement('button');
                    button.classList.add('list-group-item', 'list-group-item-action');
                    button.appendChild(document.createTextNode(user.username));
                    followList.appendChild(button);
                    // Make button clickable
                    button.addEventListener('click', event => displayUserProfile(user));
                }));
    }
}

/**
 * Make request to update the user information
 * by submit the update forms
 */
const updateProfile = () => {
    const name = updateName.value;
    const email = updateEmail.value;
    const password = updatePassword.value;
    api.updateProfile(localStorage.getItem('token'), email, name, password);
    profileName.textContent = name;
    profileEmail.textContent = email;
    update.style.display = 'none';
}