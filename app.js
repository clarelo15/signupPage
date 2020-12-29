require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const fName = req.body.first;
  const lName = req.body.last;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fName,
        LNAME: lName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us17.api.mailchimp.com/3.0/lists/7775103238";
  const options = {
    method: "POST",
    auth: process.env.AUTH
  }

  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {
      const getBackData = JSON.parse(data);
      const status = response.statusCode;
      if (status === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
      console.log(status);
    })
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function(response) {
  console.log("Server is running on port 3000");
});


//38c05390d5f4f6f2a49ac00584284165-us17
//7775103238
