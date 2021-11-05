document.addEventListener('selectionchange', function() {
    var selection = window.getSelection().toString().replace('git clone ', '').trim();
    console.log(selection);
    chrome.runtime.sendMessage({
        request: 'updateContextMenu',
        selection: selection
    });
});