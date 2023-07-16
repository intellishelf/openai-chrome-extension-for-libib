document.addEventListener('DOMContentLoaded', () => {

    document
        .getElementById("copyButton")
        .addEventListener("click", () =>
            chrome.tabs.query({ active: true }, (tabs) =>
                chrome.tabs.sendMessage(tabs[0].id, { message: "readPage" })
            ));

    document
        .getElementById("storeOpenaiToken")
        .addEventListener("click", () =>
            chrome.storage.local.set({ openaiKey: document.getElementById("openaiKey").value })
        );

    chrome.storage.local.get(["openaiKey"]).then((result) =>
        document.getElementById("openaiKey").value = result.openaiKey
    );

    chrome.storage.local.get('imageData', (result) =>
        document.getElementById("capturedImg").src = result.imageData
    );
});

