/* global chrome */

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.runtime.openOptionsPage()
  }
})

chrome.browserAction.onClicked.addListener(function (tab) {
  if (tab) {
    chrome.tabs.sendMessage(tab.id, {
      clipboard: true
    }, function(response) {});
  }
});