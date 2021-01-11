import API from './api.js';
import { token } from './main.js';
import { displayUserProfile } from './profile.js';
const api = new API('http://localhost:5000');
// DOM elements
const profileContainer = document.getElementById('profile-container'),
    feedContainer = document.getElementById('feed-container'),
    postContainer = document.getElementById('own-post-container'),
    newPostContainer = document.getElementById('new-post-container'),
    textArea = document.getElementById('new-post-desc'),
    postImageBtn = document.getElementById('post-img-btn'),
    postimageInput = document.getElementById('post-img-input'),
    submitBtn = document.getElementById('post-submit'),
    preview = document.getElementById('img-preview');

const likeIconURL = 'https://img.icons8.com/carbon-copy/100/000000/filled-like.png',
    unlikeIconURL = 'https://img.icons8.com/plasticine/100/000000/filled-like.png';
/**
 * Display comments list
 * @param {Array} comments 
 * @return {Object} ul node contains all comments
 */
const displayComments = (comments) => {
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'list-group-flush');

    for (let i = 0; i < comments.length; i++) {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        li.appendChild(document.createTextNode(comments[i].comment));
        ul.appendChild(li);
    }
    return ul;
}

/**
 * Display like list
 * @param {Array} likes 
 */
const displayLikes = (likes) => {
    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'list-group-flush');

    for (let i = 0; i < likes.length; i++) {
        const li = document.createElement('li');
        li.classList.add('list-group-item');
        api.getUserNameByID(localStorage.getItem('token'), likes[i])
            .then(resJSON => {
                li.appendChild(document.createTextNode(resJSON.username));
                ul.appendChild(li);
            })

    }
    return ul;
}

/**
 * Convert timestampe to human readable date
 * @param {string} timestamp 
 */
const convertToDate = (timestamp) => {
    const date = new Date(Number(timestamp * 1000));
    return date.toLocaleString();
}

/**
 * Feed a single post by doing DOM manipulation
 * @param {json} feed 
 * @param {boolean} updatable - updatable if displaying own post
 */
export const showFeed = (feed, updatable = false) => {
    const id = feed.id;
    const labels = ['Author', 'Posted At', 'Image', 'Likes', 'Description', 'Comments']

    const values = {
        author: feed.meta.author,
        published: convertToDate(feed.meta.published),
        img: `data:image/png;base64, ${feed.src}`,
        likes: feed.meta.likes, // IDs of user who like this post
        description: feed.meta.description_text,
        comments: feed.comments // Comments IDs
    };

    // Create feed card
    const content = document.createElement('div');
    content.classList.add('card', 'feed-card');

    // image
    const img = document.createElement('img');
    img.setAttribute('src', values.img);
    img.setAttribute('alt', 'img itself');
    img.classList.add("card-img-top");
    content.appendChild(img);

    /************************* CARD BODY 1 **************************/
    const cardBody = document.createElement('div'); // Card container
    cardBody.classList.add('card-body');

    // author
    const author = document.createElement('a');
    author.classList.add('card-text');
    author.appendChild(document.createTextNode(values.author));
    cardBody.appendChild(author);

    // description
    const description = document.createElement('p');
    description.classList.add('card-text');
    description.appendChild(document.createTextNode(values.description));
    cardBody.appendChild(description);


    // published
    const published = document.createElement('p');
    published.classList.add('card-text');
    published.appendChild(document.createTextNode(`Published ${values.published}`));
    cardBody.appendChild(published);
    content.appendChild(cardBody);

    /************************* CARD BODY 2 **************************/
    /** likes and comments button to see who likes/comments this post */
    const cardBody2 = document.createElement('div');
    cardBody2.classList.add('card-body');

    const likes = document.createElement('button');
    likes.classList.add('card-link', 'btn', 'btn-light');
    likes.appendChild(document.createTextNode(`Likes ${values.likes.length}`));
    const likeList = displayLikes(values.likes);

    const comments = document.createElement('button');
    comments.classList.add('card-link', 'btn', 'btn-light');
    comments.appendChild(document.createTextNode(`Comments ${values.comments.length}`));
    const commentList = displayComments(values.comments);

    /************************* CARD BODY 3 **************************/
    /** Like */
    const cardBody3 = document.createElement('div');
    cardBody3.classList.add('card-body');

    const likeBtn = document.createElement('img');
    likeBtn.classList.add('card-link');
    likeBtn.setAttribute('src', likeIconURL);
    likeBtn.style.cursor = 'pointer';
    likeBtn.style.width = '50px';
    likeBtn.style.height = '50px';
    likeBtn.style.float = 'right';

    /** Update */
    const updateBtn = document.createElement('button');
    updateBtn.classList.add('card-link', 'btn', 'btn-info');

    const cancelBtn = document.createElement('button');
    cancelBtn.classList.add('card-link', 'btn', 'btn-secondary');

    const confirmBtn = document.createElement('button');
    confirmBtn.classList.add('card-link', 'btn', 'btn-success');

    const descriptionTextArea = document.createElement('textarea');
    descriptionTextArea.classList.add('form-control');
    descriptionTextArea.value = values.description;

    /** Delete */
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('card-link', 'btn', 'btn-danger');

    /** Comment */
    const commentBtn = document.createElement('button');
    commentBtn.classList.add('btn', 'btn-primary');
    commentBtn.style.float = 'right';
    const commentTextArea = document.createElement('textarea');
    commentTextArea.classList.add('form-control');

    updateBtn.appendChild(document.createTextNode('UPDATE'));
    cancelBtn.appendChild(document.createTextNode('CANCEL'));
    confirmBtn.appendChild(document.createTextNode('CONFIRM'));
    deleteBtn.appendChild(document.createTextNode('DELETE'));
    commentBtn.appendChild(document.createTextNode('Post Comment'));


    // Append children to form the post card
    cardBody2.appendChild(likes);
    cardBody2.appendChild(comments);
    // cardBody2.appendChild(document.createElement('br'));

    // if the post is updatable if in user profile
    // otherwise the post is fed which can be commented by logged user
    if (updatable) {
        cardBody3.appendChild(likeBtn);
        cardBody3.appendChild(updateBtn);
        cardBody3.appendChild(cancelBtn);
        cardBody3.appendChild(confirmBtn);
        cardBody3.appendChild(deleteBtn);
        cancelBtn.style.display = 'none';
        confirmBtn.style.display = 'none';
    } else {
        cardBody2.appendChild(likeBtn);
    }

    cardBody3.appendChild(commentTextArea);
    cardBody3.appendChild(commentBtn);

    content.appendChild(cardBody2);
    content.appendChild(cardBody3);

    content.appendChild(likeList);
    content.appendChild(commentList);
    commentList.style.display = 'none'; // Default display like list

    if (updatable) postContainer.appendChild(content);
    else feedContainer.appendChild(content);


    /************************* EVENT LISTENERS  **************************/
    // access user profile by click on username
    author.addEventListener('click', event =>
        api.getUserByName(localStorage.getItem('token'), values.author)
        .then(user => {
            feedContainer.style.display = 'none';
            displayUserProfile(user, false);
        })
        .catch(err => console.log(err)));

    // toggle like list and comment list
    likes.addEventListener('click', event => {
        commentList.style.display = 'none';
        likeList.style.display = 'block';
    });
    comments.addEventListener('click', event => {
        commentList.style.display = 'block';
        likeList.style.display = 'none';
    });

    // Like post
    likeBtn.addEventListener('click', event => {
        api.likePost(localStorage.getItem('token'), id);
        likeBtn.setAttribute('src', unlikeIconURL);
    });
    // Comment post
    commentBtn.addEventListener('click', event => api.postComment(localStorage.getItem('token'), commentTextArea.value, id));
    /** Make the post updatable */
    if (updatable) {
        updateBtn.addEventListener('click', event => {
            // console.log(description)
            updateBtn.style.display = 'none';
            cancelBtn.style.display = 'inline-block';
            confirmBtn.style.display = 'inline-block';
            cardBody.replaceChild(descriptionTextArea, description);
        });
        cancelBtn.addEventListener('click', event => {
            updateBtn.style.display = 'inline-block';
            cancelBtn.style.display = 'none';
            confirmBtn.style.display = 'none';
            cardBody.replaceChild(description, descriptionTextArea);
        });
        confirmBtn.addEventListener('click', event => {
            updateBtn.style.display = 'inline-block';
            cancelBtn.style.display = 'none';
            confirmBtn.style.display = 'none';
            cardBody.replaceChild(description, descriptionTextArea);
            description.textContent = descriptionTextArea.value;
            api.updatePost(localStorage.getItem('token'), id, descriptionTextArea.value);
        });
        deleteBtn.addEventListener('click', event => {
            api.deletePost(localStorage.getItem('token'), id);
            content.style.display = 'none';
        });
    }
}

/**
 * Convert image to base64 and set to src
 * @param {object} img - DOM node of preview image 
 */
const getImage = (img) => {
    const reader = new FileReader();
    reader.readAsDataURL(img.files[0]);
    reader.onloadend = () => {
        preview.src = reader.result;
    };
}

postimageInput.addEventListener('change', event => getImage(event.target));
postImageBtn.addEventListener('click', event => postimageInput.click());
submitBtn.addEventListener('click', event => api.newPost(localStorage.getItem('token'), textArea.value, preview.src));