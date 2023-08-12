// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.


function writeOnClipboard(newClip) {
    navigator.clipboard.writeText(newClip).then(
        () => {
            /* clipboard successfully set */
            //alert(`Copied succesfully to clipboard:\n${newClip}`);
            const copyButton = document.getElementById("copyVideoURLButton");
            copyButton.innerHTML = "Copied!";

            setTimeout(() => {
                document.getElementById("copyVideoURLButton").innerHTML = "Copy";

            }, 2000);

        },
        () => {
            alert(`Error.`);
            console.log(`Error while copying this text:\n${newClip}`);
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

async function downloadVideo() {
    let mediaURL = window.location.href;
    if (!mediaURL) {
        alert('Error: no media URL found');
        return;
    }
    let dlURL = mediaURL.replace('https://twitter.com', 'https://x2twitter.com');
    window.open(dlURL, '_blank');
}



async function tryAddButton() {
    // console.log('tryAddButton()');

    if (document.getElementById("copyVideoURLButton")) {
        console.log('Button already added!');
        return;
    }

    const regex = /^https:\/\/twitter\.com\/[^/]+\/status\/\d+$/;
    const regexX = /^https:\/\/x\.com\/[^/]+\/status\/\d+$/;
    if (!regex.test(window.location.href) && !regex2.test(window.location.href)) {
        console.log('Not a tweet page!');
        return;
    }
    if (!getMediaURL()) {
        console.log('No media URL found! I found this: ' + document.title);
        return;
    }


    const firstTweet = document.querySelectorAll('article[data-testid="tweet"]')[0];
    if (!firstTweet) {
        console.log('No tweet found!');
        return;
    }
    const ftwVideo = firstTweet.querySelectorAll('div[data-testid="videoPlayer"]')[0];
    if (!ftwVideo) {
        console.log('No video found!');
        return;
    }


    // Create a flexbox container for the buttons
    let buttonsContainer = document.createElement("div");
    buttonsContainer.id = "buttonsContainer";

    // COPY BUTTON
    let copyButtonHTML = `<button id="copyVideoURLButton">Copy</button>`;

    let copyButton = document.createElement("div");
    copyButton.innerHTML = copyButtonHTML;
    copyButton = copyButton.firstElementChild;

    copyButton.addEventListener("click", copyLinkInTitle);

    buttonsContainer.appendChild(copyButton);

    // DOWNLOAD BUTTON
    let downloadButtonHTML = `<button id="downloadVideoButton">Download</button>`;

    let downloadButton = document.createElement("div");
    downloadButton.innerHTML = downloadButtonHTML;
    downloadButton = downloadButton.firstElementChild;

    downloadButton.addEventListener("click", downloadVideo);

    buttonsContainer.appendChild(downloadButton);

    // Add the buttons container to the top right of the div player
    ftwVideo.prepend(buttonsContainer);

}




// MAIN -------
// calling the tryAddButton() in different ways

tryAddButton();

function addLocationObserver(callback) {
    // Options for the observer (which mutations to observe)
    const config = { attributes: false, childList: true, subtree: true };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback)

    // Start observing the target node for configured mutations
    observer.observe(document.querySelector('body'), config);
}

addLocationObserver(tryAddButton);