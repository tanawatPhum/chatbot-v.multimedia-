

(function() {
    // Load the script
    var script = document.createElement("SCRIPT");
    script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js';
    script.type = 'text/javascript';
    script.onload = function() {
        var $ = window.jQuery;
        $("#click").click(function(){
            console.log("hello world")

        });
    
    };
    document.getElementsByTagName("head")[0].appendChild(script);
})();

function addCart() {
    let url = "http://ybat.oneweb.tech/eaf-rest/DMPManualServlet?key=addcart";
    let method = "POST";
    let async = true;
    let request = new XMLHttpRequest();
    let postData  = JSON.stringify({
        businessUserId:"1066",
        itemPrice:null,
        itemQuantity: 1,
        productItemId:24,
        vipCode:null,
    });
    request.onload = function () {
        
           // Because of javascript's fabulous closure concept, the XMLHttpRequest "request"
           // object declared above is available in this function even though this function
           // executes long after the request is sent and long after this function is
           // instantiated. This fact is CRUCIAL to the workings of XHR in ordinary
           // applications.
        
           // You can get all kinds of information about the HTTP response.
           var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
           var data = request.responseText; // Returned data, e.g., an HTML document.
    }
    request.open(method, url, async);    
    request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    request.setRequestHeader("authorization", "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJkbXBzeXN0ZW0iLCJjbGllbnRJZCI6ImFiYyIsImV4cCI6MTUwODgzODgwMSwiaXNzIjoiY29tLmF2YWxhbnQuand0In0.apJ8_q9s73zLpU-DJ9QfxqGL8N0RSNx8NWedmlNykKxx9rlE6upam6ebXSrOWYgTMulQIrS-XMpeC9P-f1izDg");
    request.setRequestHeader("clientId", "abc");
    request.send(postData);

}

 
