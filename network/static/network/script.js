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
        editButton.onclick = () => {
            replaceWithTextarea(postId);
        };

        if (editArea) {
            editArea.remove();
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
