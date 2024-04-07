

var colorBox = document.createElement('div');
colorBox.style.position = 'fixed';
colorBox.style.width = '50px';
colorBox.style.height = '50px';
colorBox.style.border = '2px solid black';
colorBox.style.backgroundColor = 'white';
colorBox.style.display = 'none'; 


var rgbText = document.createElement('div');
rgbText.style.position = 'fixed';
rgbText.style.fontSize = '12px';
rgbText.style.backgroundColor = 'white';
rgbText.style.display = 'none'; 

var hexText = document.createElement('div');
hexText.style.position = 'fixed';
hexText.style.fontSize = '12px';
hexText.style.backgroundColor = 'white';
hexText.style.display = 'none'; 


document.body.appendChild(colorBox);
document.body.appendChild(rgbText);
document.body.appendChild(hexText);


function updateColor(x, y, color) {
  colorBox.style.display = 'block';
  colorBox.style.left = (x + 10) + 'px'; 
  colorBox.style.top = (y + 10) + 'px'; 
  colorBox.style.backgroundColor = color;
}

function updateColorText(x, y, color) {
  rgbText.style.display = 'block';
  hexText.style.display = 'block';
  rgbText.style.left = (x + 65) + 'px'; 
  rgbText.style.top = (y + 20) + 'px'; 
  hexText.style.left = (x + 65) + 'px'; 
  hexText.style.top = (y + 40) + 'px'; 

  var rgb = hexToRgb(color);
  rgbText.textContent = 'RGB: ' + rgb.r + ', ' + rgb.g + ', ' + rgb.b;
  hexText.textContent = 'Hex: ' + color;
}

function hexToRgb(hex) {
  var bigint = parseInt(hex.slice(1), 16);
  var r = (bigint >> 16) & 255;
  var g = (bigint >> 8) & 255;
  var b = bigint & 255;
  return { r: r, g: g, b: b };
}


function getColorAtPosition(x, y) {
  var element = document.elementFromPoint(x, y);
  if (!element) return 'transparent';


  if (element instanceof HTMLImageElement) {
    var canvas = document.createElement('canvas');
    canvas.width = element.width;
    canvas.height = element.height;
    var context = canvas.getContext('2d');
    context.drawImage(element, 0, 0, element.width, element.height);
    var pixelData = context.getImageData(x - element.getBoundingClientRect().left, y - element.getBoundingClientRect().top, 1, 1).data;

   
    var red = pixelData[0];
    var green = pixelData[1];
    var blue = pixelData[2];


    return rgbToHex(red, green, blue);
  } else {
    
    var style = window.getComputedStyle(element);
    return style.getPropertyValue('background-color') || style.getPropertyValue('color');
  }
}

function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.enableColorDetection) {
 
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', click);
  } else if (message.disableColorDetection) {
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('click', click);
    
    colorBox.style.display = 'none';
    rgbText.style.display = 'none';
    hexText.style.display = 'none';
  }
});

var rgbDisplay = null;
var hexDisplay = null;

function handleMouseMove(event) {

  var x = event.clientX;
  var y = event.clientY;

  var color = getColorAtPosition(x, y);

  updateColor(x, y, color);
  updateColorText(x, y, color);
  window.color = color;
}

var rgbDisplay = null;
var hexDisplay = null;

function click () {

    var rgb = hexToRgb(color);
    rgb = 'RGB: ' + rgb.r + ', ' + rgb.g + ', ' + rgb.b;
    var hex = 'Hex: ' + color;

    if (rgbDisplay && hexDisplay) {
        rgbDisplay.remove();
        hexDisplay.remove();
    }


    rgbDisplay = document.createElement('div');
    hexDisplay = document.createElement('div');
    rgbDisplay.style.position = 'fixed';
    rgbDisplay.style.top = '5px';
    rgbDisplay.style.left = '0px';
    rgbDisplay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    rgbDisplay.style.padding = '5px';
    rgbDisplay.style.zIndex = '9999'; 

    hexDisplay.style.position = 'fixed';
    hexDisplay.style.top = '40px';
    hexDisplay.style.left = '0px';
    hexDisplay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    hexDisplay.style.padding = '5px';
    hexDisplay.style.zIndex = '9999';


    function copyTextToClipboard(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
    }

    
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

    
    rgbDisplay.textContent =  rgb;
    createCopyButton(rgbDisplay, rgb);

    hexDisplay.textContent =  hex;
    createCopyButton(hexDisplay, hex);

 
    document.body.appendChild(rgbDisplay);
    document.body.appendChild(hexDisplay);

   
    setTimeout(function() {
        rgbDisplay.remove();
        hexDisplay.remove();
    }, 10000); 
}





