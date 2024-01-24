function replaceWithTextarea(postId) {
    let contentBox = document.querySelector('#post-' + postId);
    let content = contentBox.innerHTML;

    let editArea = document.createElement('textarea');
    editArea.className = "form-control custom-textarea";
    editArea.id = `editpost-${postId}`;
    editArea.value = content; 

    let parent = contentBox.parentElement;
    parent.insertBefore(editArea, parent.firstChild);
    contentBox.remove();
    editButton = parent.querySelector("button")
    editButton.innerHTML = "Save"
    editButton.classList.remove("edit");
    editButton.classList.add("save");
    editButton.onclick = () => {
        let updatedContent = editArea.value;
        updatePost(postId, updatedContent);
    };
}

function updatePost(postId, content) {
    let formData = new FormData();
    formData.append('postId', postId);
    formData.append('content', content);

    fetch('/update_post', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCSRFToken(),
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Update the post content on the page
        let contentBox = document.createElement('p');
        contentBox.innerHTML = content;
        contentBox.className = "content card-text";
        contentBox.id = `post-${postId}`

        let editArea = document.getElementById(`editpost-${postId}`);
        let parent = editArea.parentElement;
        parent.insertBefore(contentBox, parent.firstChild);

        let editButton = parent.querySelector("button");
        editButton.innerHTML = "Edit";
        editButton.classList.remove("save");
        editButton.classList.add("edit");
        editButton.onclick = () => {
            replaceWithTextarea(postId);
        };

        if (editArea) {
            editArea.remove();

        let parts = data.last_updated.split(' ');
        parts[0] = parts[0].toupperCase();
        let formattedDate = parts.join(' ');
        }
        let history = document.querySelector(`#history-${postId}`)
        if (history) {
            history.innerHTML = `Edited at: ${formattedDate}`;
        }
    })
    .catch(error => console.error('Error:', error));
}

function getCSRFToken() {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith('csrftoken=')) {
            return cookie.substring('csrftoken='.length, cookie.length);
        }
    }
    return '';
}

function toggleLike(postId, username){
    let formData = new FormData();
    formData.append('postId', postId);
    formData.append('username', username);

    fetch('/toggle_like', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCSRFToken(),
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Update the like number
        let counter = document.querySelector(`#like-count-${postId}`)
        counter.textContent = data.counter;
        if (data.action == "add"){
            let likeButton = document.querySelector(`#like-${postId}`)
            likeButton.innerHTML = "Unlike"
            likeButton.id = `unlike-${postId}`}
        else if ( data.action == "remove"){
            let likeButton = document.querySelector(`#unlike-${postId}`)
            likeButton.innerHTML = "Like"
            likeButton.id = `like-${postId}`}
    })
    .catch(error => console.error('Error:', error));
}