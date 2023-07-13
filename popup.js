document.addEventListener('DOMContentLoaded', function () {
    const copyButton = document.getElementById("copyButton");
    copyButton.addEventListener("click", function () {
        chrome.tabs.query({ active: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { message: "readPage" });
        });
    });

});





