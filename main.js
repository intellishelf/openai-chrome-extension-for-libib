var http = new XMLHttpRequest();
var url = 'https://www.libib.com/library/manual-entry/submit';
var params = 'title=foo&manual-entry-library-select=863770&manual-entry-type=book&';
http.open('POST', url, true);

//Send the proper header information along with the request
http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

http.onreadystatechange = function() {//Call a function when the state changes.
    if(http.readyState == 4 && http.status == 200) {
        alert(http.responseText);
    }
}
http.send(params);