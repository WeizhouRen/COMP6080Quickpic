import { popupModal } from './helpers.js';

/**
 * Process the resposne, if success, console log the result
 * if fail give a pop up modal with error message
 * @param {json} res 
 * @param {json} message 
 */
const processResponse = (res, message) => {
    if (res.status === 200)
        res.json().then(resJSON => {
            console.log(message.success, resJSON);
        });
    else res.json().then(err => {
        popupModal(message.fail, err.message);
    });
}


/**
 * This is a sample class API which you may base your code on.
 * You may use this as a launch pad but do not have to.
 */
export default class API {
    /** @param {String} url */
    constructor(url) {
        this.url = url;
    }

    /** @param {String} path */
    makeAPIRequest(path, options) {
        return getJSON(`${this.url}/${path}`, options);
    }

    /**
     * Making post request, used in sign up and login
     * @param {string} path 
     * @param {JSON} data 
     */
    post(path, data) {
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        }

        return fetch(`${this.url}/${path}`, options);
    }

    /**
     * Following user by specify it username after getting token
     * @param {string} username 
     * @param {string} token 
     */
    follow(username, token) {
        return fetch(`${this.url}/user/follow?username=${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
            .then(res => processResponse(res, {
                success: `Follow ${username} sucesee!`,
                fail: 'Follow Error'
            }));
    }

    unfollow(username, token) {
        return fetch(`${this.url}/user/unfollow?username=${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
            .then(res => processResponse(res, {
                success: `Unfollow ${username} success!`,
                fail: 'Unfollow Error'
            }));
    }

    /**
     * Get feed data
     * @param {json} options 
     */
    getFeed(token) {
        return fetch(`${this.url}/user/feed`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
            .then(feed => feed.json());
    }

    likePost(token, postId) {
        fetch(`${this.url}/post/like?id=${postId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`
            }
        }).then(res => processResponse(res, {
            success: `Like post ${postId} successs!`,
            fail: 'Like Error'
        }));
    }

    getUserNameByID(token, id) {
        return fetch(`${this.url}/user?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
            .then(user => user.json());
    }

    getUserByName(token, username) {
        return fetch(`${this.url}/user?username=${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
            .then(user => user.json());
    }

    getPostByID(token, id) {
        return fetch(`${this.url}/post?id=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
            .then(post => post.json());
    }

    getLoggedInUser(token) {
        return fetch(`${this.url}/user/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
            .then(user => user.json());
    }

    newPost(token, description, src) {
        return fetch(`${this.url}/post/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    'description_text': description,
                    'src': src.split(',')[1]
                })
            })
            .then(json => processResponse(json, {
                success: `post successs!`,
                fail: 'Post Error'
            }));
    }

    updatePost(token, postId, description) {
        return fetch(`${this.url}/post?id=${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    'description_text': description
                })
            })
            .then(json => processResponse(json, {
                success: `Update ${postId} successs!`,
                fail: 'Post Error'
            }));
    }

    deletePost(token, postId) {
        return fetch(`${this.url}/post?id=${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
            .then(json => processResponse(json, {
                success: `Delete ${postId} successs!`,
                fail: 'Delete Error'
            }))
    }

    postComment(token, comment, postId) {
        return fetch(`${this.url}/post/comment?id=${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    "comment": comment
                })
            })
            .then(json => processResponse(json, {
                success: `Comment ${postId} successs!`,
                fail: 'Comment Error'
            }));
    }

    updateProfile(token, email, name, password) {
        return fetch(`${this.url}/user/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({
                    "email": email,
                    "name": name,
                    "password": password
                })
            })
            .then(json => processResponse(json, {
                success: `Update ${name} successs!`,
                fail: 'Update Error'
            }))
    }
}

// export { API, popupModal };