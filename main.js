var cmid;

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  if (msg.request === 'updateContextMenu') {
    (msg.selection.indexOf('.git') !== -1) && (msg.selection.split(' ').length === 1) ? add() : remove();
  }
});

const add = () => {
  const options = {
    title: "Open in GitKraken",
    contexts:["selection"],
    onclick: (word) => {
      chrome.tabs.create({url: `gitkraken://repolink/1?url=${word.selectionText}`});
    }
  }
  cmid != null ? chrome.contextMenus.update(cmid, options) : cmid = chrome.contextMenus.create(options);
}

const remove = () => {
  if (cmid != null) { chrome.contextMenus.remove(cmid); cmid = null; }
}

