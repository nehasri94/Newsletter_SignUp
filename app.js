const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public")); // to display the static content like css and images (local files) which we need to render to server

app.get('/', function(req, res){
    res.sendFile(__dirname + "/signup.html");

});

app.post('/', function(req, res){
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const email = req.body.email;
    // res.send("Welcome " + firstName);
    // this is the data in java object format which we want to send as a request to the mailchimp after converting it into JSON format
    const data = {
        members : [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);
    
    // Replace X with the number (between 1-20) as mentioned in the API key and replace the {list_id} with its value and in the auth key, the username is any string and password is the API-Key.

    const url = "https://usX.api.mailchimp.com/3.0/lists/{list_id}";

    const options = {
       
            method: "POST",
            auth:"neha:API-Key" 
        
    }

    const request = https.request(url, options, function(response){

           if(response.statusCode === 200){
              // res.send("Successfully subscribed!");
              res.sendFile(__dirname + "/success.html");
           }else{
               //res.send("Uh ohh, there was some problem signing you up!, try again later");
               res.sendFile(__dirname + "/failure.html");
           }
           response.on("data", function(data){
               console.log(JSON.parse(data));
           });
    });

      request.write(jsonData);
      request.end();
});

app.post('/failure', function(req, res){
      res.redirect('/');

});

// to deploy on heroku we have modified the port number
app.listen(process.env.PORT || 3000, function(){
    console.log("Server running on port 3000");
});