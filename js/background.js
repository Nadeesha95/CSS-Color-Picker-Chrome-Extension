chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message && message.action === 'showAlert') {
        chrome.tabs.sendMessage(sender.tab.id, {action: 'showAlert', checked: message.checked});
    }
});