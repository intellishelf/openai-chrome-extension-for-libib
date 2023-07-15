
chrome.runtime.onMessage.addListener(request => {
  if (request.contentScriptQuery == "query") {
    chrome.storage.local.get(["openaiKey"]).then((result) =>
      askGPT(request.message, result.openaiKey));
  }
});


function askGPT(text, openaiKey) {

  let prompt =
    `The user copied the following text from a browser tab which explains a book.` +
    `Find in that text a name of the book, author, description, number of pages, year of publication and ISBN.` +
    `Return it in JSON format: `

  let message = prompt + text;

  console.log(message)
  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ` + openaiKey
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
    .then(d => JSON.parse(d.choices[0].message.content))
    .then(bookInfo => {

      console.log(bookInfo)
      //addToLibib(bookInfo);


    })
}

function addToLibib(bookInfo) {
  var libibUrl = 'https://www.libib.com/library/manual-entry/submit';

  const formData = new FormData();
  formData.append('title', bookInfo["book"]);
  formData.append('creators', bookInfo["author"]);
  formData.append('manual-entry-library-select', '863770');
  formData.append('manual-entry-type', 'book');

  fetch(libibUrl, {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(d => console.log(d));
}


