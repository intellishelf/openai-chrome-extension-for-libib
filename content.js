chrome.runtime.onMessage.addListener((request) => {
    if (request.message == 'readPage') {
        chrome.runtime.sendMessage({ message: fetchVisibleText(window.document), contentScriptQuery: 'query' });
    }
});

chrome.runtime.onMessage.addListener((request) => {
    if (request.command == 'handleImgDataUrl')
        convertImgToJPEG(request.imgDataUrl)
            .then(blob => {
                var reader = new FileReader();

                reader.onloadend = () =>
                    chrome.storage.local.set({ imageData: reader.result })

                reader.readAsDataURL(blob);
            });

});

chrome.runtime.onMessage.addListener((request) => {
    if (request.command == 'readImage')
        chrome.runtime.sendMessage({ command: 'fetchImageAsDataUrl', url: findFirstImgElement(clickedEl).src });
});

var clickedEl = null;

document.addEventListener("contextmenu", function (event) {
    clickedEl = event.target;
}, true);


function fetchVisibleText(currentDocument) {
    let visibleText = '';

    function traverse(node) {
        if (node.nodeType === Node.TEXT_NODE && node.parentNode.offsetHeight > 0) {
            visibleText += node.textContent.trim() + ' ';
        }

        if (node.childNodes && node.childNodes.length > 0) {
            for (let i = 0; i < node.childNodes.length; i++) {
                traverse(node.childNodes[i]);
            }
        }
    }

    traverse(currentDocument.body);

    return visibleText.trim();
}
function findFirstImgElement(element) {
    // Check if the current element is an img element
    if (element.tagName === 'IMG') {
      return element;
    }
  
    // Recursively traverse the child nodes of the current element
    var children = element.children;
    for (var i = 0; i < children.length; i++) {
      var imgElement = findFirstImgElement(children[i]);
      if (imgElement) {
        return imgElement;
      }
    }
  
    // Recursively traverse the siblings on the same level
    var sibling = element.nextElementSibling;
    while (sibling) {
      var imgElement = findFirstImgElement(sibling);
      if (imgElement) {
        return imgElement;
      }
      sibling = sibling.nextElementSibling;
    }
  
    // Recursively traverse all parents
    var parent = element.parentElement;
    while (parent) {
      var imgElement = findFirstImgElement(parent);
      if (imgElement) {
        return imgElement;
      }
      parent = parent.parentElement;
    }
  
    // Return null if no img element is found
    return null;
  }
function convertImgToJPEG(dataURL) {
    return new Promise(function (resolve, reject) {
        var img = new Image();

        img.onload = function () {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            // Set the canvas dimensions to match the image
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw the image onto the canvas
            ctx.drawImage(img, 0, 0);

            // Convert the canvas content to a Blob in JPEG format
            canvas.toBlob(function (blob) {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Failed to convert image to JPEG format.'));
                }
            }, 'image/jpeg');
        };

        img.onerror = function () {
            reject(new Error('Failed to load image.'));
        };

        img.src = dataURL;
    });
}
