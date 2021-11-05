openGK = function(word){
  var query = word.selectionText;
  chrome.tabs.create({url: `gitkraken://repolink/1?url=${query}`});
};

chrome.contextMenus.create({
  title: "Open in GitKraken",
  contexts:["selection"],
  onclick: openGK
});
