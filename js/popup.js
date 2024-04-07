document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the checkbox element
    const checkbox = document.getElementById('toggleCheckbox');
  
    // Check if the checkbox state is stored in localStorage
    const storedCheckboxState = localStorage.getItem('checkboxState');
  
    // If the checkbox state is found in localStorage, set the checkbox accordingly
    if (storedCheckboxState && storedCheckboxState === 'checked') {
      checkbox.checked = true;

      localStorage.setItem('checkboxState', 'checked');
      // Send message to content script to enable color detection
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {enableColorDetection: true});
      });
      
    }

  
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        localStorage.setItem('checkboxState', 'checked');
        // Send message to content script to enable color detection
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {enableColorDetection: true});
        });
      } else {
        localStorage.removeItem('checkboxState');
        // Send message to content script to disable color detection
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {disableColorDetection: true});
        });
      }
    });


  });


