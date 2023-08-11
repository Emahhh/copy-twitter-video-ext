// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.

function writeOnClipboard(newClip) {
    navigator.clipboard.writeText(newClip).then(
        () => {
            /* clipboard successfully set */
            alert(`Copied succesfully to clipboard:\n${newClip}`); // TODO: remove this alert. give some w the button
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
    console.log('tryAddButton()');

    if (document.getElementById("copyVideoURLButton")) {
        //alert('Button already added!');
        console.log('Button already added!');
        return;
    }

    setTimeout(tryAddButton, 1000);

    const regex = /^https:\/\/twitter\.com\/[^/]+\/status\/\d+$/;
    if (!regex.test(window.location.href)) {
        //alert('Not a tweet page!');
        console.log('Not a tweet page!');
        return;
    }
    if (!getMediaURL()) {
        //alert('No media URL found! I found this: ' + document.title);
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

    let button = document.createElement("button");
    button.innerHTML = "Copy video URL";
    button.id = "copyVideoURLButton";
    button.addEventListener("click", copyLinkInTitle);
    // add button to the top right of the div player
    ftwVideo.prepend(button);
}


tryAddButton();


function addLocationObserver(callback) {

    // Options for the observer (which mutations to observe)
    const config = { attributes: false, childList: true, subtree: false }
  
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback)
  
    // Start observing the target node for configured mutations
    observer.observe(document.body, config)
  }
  

  
  addLocationObserver(tryAddButton);
