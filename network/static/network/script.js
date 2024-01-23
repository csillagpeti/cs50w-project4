contentbox = document.querySelector('#post-11')
content = contentbox.innerHTML
editarea = document.createElement('textarea')
editarea.className = "form-control custom-textarea"
editarea.innerHTML = content
parent = contentbox.parentElement
parent.insertBefore(editarea, parent.firstChild)
contentbox.remove()