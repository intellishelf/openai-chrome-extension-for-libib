chrome.runtime.onMessage.addListener(function (request) {
    if (request.message == 'readPage') {
        chrome.runtime.sendMessage({ message: fetchVisibleText(window.document), contentScriptQuery: 'query' });
    }
});



function fetchVisibleText(currentDocument) {
    let visibleText = '';

    // Recursive function to traverse DOM nodes
    function traverse(node) {
        // Check if node is a text node and not hidden
        if (node.nodeType === Node.TEXT_NODE && node.parentNode.offsetHeight > 0) {
            visibleText += node.textContent.trim() + ' ';
        }

        // Traverse child nodes
        if (node.childNodes && node.childNodes.length > 0) {
            for (let i = 0; i < node.childNodes.length; i++) {
                traverse(node.childNodes[i]);
            }
        }
    }

    // Start traversal from the document body
    traverse(currentDocument.body);

    // Return the fetched visible text
    return visibleText.trim();
}