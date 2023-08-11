// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.

function writeOnClipboard(newClip) {
    navigator.clipboard.writeText(newClip).then(
        () => {
            /* clipboard successfully set */
            alert(`Copied succesfully to clipboard:\n${newClip}`);
        },
        () => {
            alert(`Error while copying this text:\n${newClip}`);
        }
    );
}

function getMediaURL() {
    let mediaURLs = document.title.match(/(\bhttps?:\/\/t\.co\/[\w-\.]+)/g);
    let mediaURL = mediaURLs?.slice(-1)[0];
    return mediaURL;
}

function copyLinkInTitle() {
    let mediaURL = getMediaURL();
    if (mediaURL) {
        writeOnClipboard(mediaURL);
    } else {
        alert('No media URL found');
    }
}




async function tryAddButton() {
    if (getMediaURL()) {
        let button = document.createElement("button");
        button.innerHTML = "Copy video URL";
        button.addEventListener("click", copyLinkInTitle);
        // Style
        button.style.position = "fixed";
        button.style.bottom = "0";
        button.style.right = "0";
        button.style.zIndex = "9999";

        document.body.appendChild(button);
    } else {
        alert('No media URL found! I found this: ' + document.title);
    }
}


    let waitForTitleInterval = setInterval(function () {
        if (document.title) {
            clearInterval(waitForTitleInterval); // Stop the interval once the title is loaded
            tryAddButton();
        } else {
            console.log('Waiting for title');
        }
    }, 100);

