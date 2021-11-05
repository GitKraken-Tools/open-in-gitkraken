document.addEventListener('selectionchange', function() {
    var selection = window.getSelection().toString().replace('git clone', '').trim();
    chrome.runtime.sendMessage({
        request: 'updateContextMenu',
        selection: selection
    });
});