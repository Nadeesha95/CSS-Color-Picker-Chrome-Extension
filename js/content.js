
// Create elements for displaying color information


var colorBox = document.createElement('div');
colorBox.style.position = 'fixed';
colorBox.style.width = '50px';
colorBox.style.height = '50px';
colorBox.style.border = '2px solid black';
colorBox.style.backgroundColor = 'white';
colorBox.style.display = 'none'; // Initially hidden

// Create text elements for displaying RGB and hex values.
var rgbText = document.createElement('div');
rgbText.style.position = 'fixed';
rgbText.style.fontSize = '12px';
rgbText.style.backgroundColor = 'white';
rgbText.style.display = 'none'; // Initially hidden

var hexText = document.createElement('div');
hexText.style.position = 'fixed';
hexText.style.fontSize = '12px';
hexText.style.backgroundColor = 'white';
hexText.style.display = 'none'; // Initially hidden

// Append the box and text elements to the document body.
document.body.appendChild(colorBox);
document.body.appendChild(rgbText);
document.body.appendChild(hexText);

// Function to update the color box position and color.
function updateColor(x, y, color) {
  colorBox.style.display = 'block';
  colorBox.style.left = (x + 10) + 'px'; // Offset for the box to not fully cover the mouse pointer
  colorBox.style.top = (y + 10) + 'px'; // Offset for the box to not fully cover the mouse pointer
  colorBox.style.backgroundColor = color;
}

// Function to update the RGB and hex text elements.
function updateColorText(x, y, color) {
  rgbText.style.display = 'block';
  hexText.style.display = 'block';
  rgbText.style.left = (x + 65) + 'px'; // Position to the right of the color box
  rgbText.style.top = (y + 20) + 'px'; // Position slightly above the color box
  hexText.style.left = (x + 65) + 'px'; // Position to the right of the color box
  hexText.style.top = (y + 40) + 'px'; // Position at the same height as the color box

  var rgb = hexToRgb(color);
  rgbText.textContent = 'RGB: ' + rgb.r + ', ' + rgb.g + ', ' + rgb.b;
  hexText.textContent = 'Hex: ' + color;
}

// Function to convert hex color to RGB.
function hexToRgb(hex) {
  var bigint = parseInt(hex.slice(1), 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;
  return { r: r, g: g, b: b };
}

// Function to get the color at a specific position on the page.
function getColorAtPosition(x, y) {
  var element = document.elementFromPoint(x, y);
  if (!element) return 'transparent';

  // For images, use a canvas to sample the color at the specific position.
  if (element instanceof HTMLImageElement) {
    var canvas = document.createElement('canvas');
    canvas.width = element.width;
    canvas.height = element.height;
    var context = canvas.getContext('2d');
    context.drawImage(element, 0, 0, element.width, element.height);
    var pixelData = context.getImageData(x - element.getBoundingClientRect().left, y - element.getBoundingClientRect().top, 1, 1).data;

    // Get the RGB color values.
    var red = pixelData[0];
    var green = pixelData[1];
    var blue = pixelData[2];

    // Return the color as a hex string.
    return rgbToHex(red, green, blue);
  } else {
    // For other elements, use the computed style.
    var style = window.getComputedStyle(element);
    return style.getPropertyValue('background-color') || style.getPropertyValue('color');
  }
}

// Function to convert RGB to hex color.
function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}



// Function to handle messages from the popup script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.enableColorDetection) {
    // Enable color detection
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', click);
  } else if (message.disableColorDetection) {
    // Disable color detection
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('click', click);
    // Hide color box and text
    colorBox.style.display = 'none';
    rgbText.style.display = 'none';
    hexText.style.display = 'none';
  }
});

var rgbDisplay = null;
var hexDisplay = null;
// Function to handle mousemove event
function handleMouseMove(event) {
  // Get mouse position
  var x = event.clientX;
  var y = event.clientY;

  // Get color at mouse position
  var color = getColorAtPosition(x, y);


  // Update color box and text
  updateColor(x, y, color);
  updateColorText(x, y, color);
  window.color = color;
}

var rgbDisplay = null;
var hexDisplay = null;

function click () {
    // Get mouse position
    // Get color at mouse position

    var rgb = hexToRgb(color);
    rgb = 'RGB: ' + rgb.r + ', ' + rgb.g + ', ' + rgb.b;
    var hex = 'Hex: ' + color;

    // Remove the existing div elements if they exist
    if (rgbDisplay && hexDisplay) {
        rgbDisplay.remove();
        hexDisplay.remove();
    }

    // Create new div elements to display the RGB and hex values
    rgbDisplay = document.createElement('div');
    hexDisplay = document.createElement('div');
    rgbDisplay.style.position = 'fixed';
    rgbDisplay.style.top = '5px';
    rgbDisplay.style.left = '0px';
    rgbDisplay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    rgbDisplay.style.padding = '5px';
    rgbDisplay.style.zIndex = '9999'; // Ensure it's on top of other elements

    hexDisplay.style.position = 'fixed';
    hexDisplay.style.top = '40px';
    hexDisplay.style.left = '0px';
    hexDisplay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    hexDisplay.style.padding = '5px';
    hexDisplay.style.zIndex = '9999';

    // Function to copy text to clipboard
    function copyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
    }

    // Function to create a copy button
    function createCopyButton(container, text) {
        const copyButton = document.createElement("button");
        copyButton.textContent = "Copy";
        copyButton.style.marginLeft = "5px";
        copyButton.addEventListener("click", function () {
            copyTextToClipboard(text);
            alert("Copied to clipboard: " + text);
        });
        container.appendChild(copyButton);
    }

    // Set text content of the RGB and hex div elements
    rgbDisplay.textContent =  rgb;
    createCopyButton(rgbDisplay, rgb);

    hexDisplay.textContent =  hex;
    createCopyButton(hexDisplay, hex);

    // Append the RGB and hex div elements to the document body
    document.body.appendChild(rgbDisplay);
    document.body.appendChild(hexDisplay);

    // Set a timeout to remove the RGB and hex div elements after a certain period
    setTimeout(function() {
        rgbDisplay.remove();
        hexDisplay.remove();
    }, 10000); // Remove after 10 seconds
}





