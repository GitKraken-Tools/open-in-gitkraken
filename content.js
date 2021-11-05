document.addEventListener('selectionchange', function() {
    var selection = window.getSelection().toString().trim();
    console.log(selection);
    chrome.runtime.sendMessage({
        request: 'updateContextMenu',
        selection: selection
    });
});