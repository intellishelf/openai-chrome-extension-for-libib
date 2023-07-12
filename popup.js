document.addEventListener('DOMContentLoaded', function () {
    var copyButton = document.getElementById('copyButton');
    copyButton.addEventListener('click', function () {
        chrome.tabs.executeScript({
            code: 'window.getSelection().toString();',
        }, function (result) {
            var text = result[0];
            chrome.permissions.request({
                permissions: ['clipboardWrite']
            }, function (granted) {
                if (granted) {
                    parse(text);
                }
            });
        });
    });
});

mainConsole = chrome.extension.getBackgroundPage().console;



function parse(text) {

    let prompt = "The user copied the following text from a browser tab which explain a book. Find in that text a name of a book, author, description, number of pages, year of publication and ISBN. Return it in JSON format: "
    let message = prompt + text;
    console.log(message)

    fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer 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`
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo-16k",
            "messages": [{ "role": "user", "content": message }],
            "temperature": 0,
            "max_tokens": 1000,
            "top_p": 1,
            "frequency_penalty": 0.0,
            "presence_penalty": 0.0,
            "stop": ["abracadabra"]
        })
    })
        .then(r => r.json())
        .then(function (data) {
            var result = data.choices[0].message.content;


            var bookInfo = JSON.parse(result);

            let titleParameter = "title=" + bookInfo["book"];

            alert(titleParameter);

            var http = new XMLHttpRequest();
            var url = 'https://www.libib.com/library/manual-entry/submit';
            var params = 'manual-entry-library-select=863770&manual-entry-type=book&' + titleParameter;
            http.open('POST', url, true);

            //Send the proper header information along with the request
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

            http.onreadystatechange = function () {//Call a function when the state changes.
                if (http.readyState == 4 && http.status == 200) {
                    alert(http.responseText);
                }
            }
            http.send(params);
        });
}
