console.log('BACKGROUND');
chrome.browserAction.setPopup({popup: './login.popup.html'});
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    chrome.browserAction.setPopup({popup: './login.popup.html'});
    return true;
})