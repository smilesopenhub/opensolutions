var express=require("express");
var app=express();
var bodyParser = require('body-parser');
var mongojs=require('mongojs');
var db=mongojs('eco',['alerts']);

// instruct the app to use the `bodyParser()` middleware for all routes
//app.use(bodyParser());

var cors = require('cors');
app.use(cors());
var requestify = require('requestify');


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

/*app.get('/',function(req,res){
res.send("Welcome");
});*/

app.use(express.static(__dirname+"/public"));

app.post("/alerts",function(req,res)
{
	
	db.alerts.insert(req.body,function(err,docs)
	{
		console.log("yes : "+docs.toString());
		res.json(docs);
	});
	//console.log("Req: %j", req.body);
	
	
	//res.json(req.body);
	//Block For Push the data
	
	/*requestify.post('http://geofence.cloudapp.net/odata/Geofence',req.body).then(function(response) {
		//console.log("Response: %j",+response.getBody());
		 res.json(response.getBody());
	});*/
	
});
app.get("/alerts",function(req,res)
{
	console.log("before hit the url ");
	db.alerts.find(function(err,docs)
	{
		console.log("yes : "+docs.toString());
		res.json(docs);
	});
	/*requestify.get("http://geofence.cloudapp.net/odata/Geofence?$filter=ID%20gt%202033",function(req,res)
	{
		console.log("response : +"+res);
	});
	
		requestify.get('http://geofence.cloudapp.net/odata/Geofence?$filter=ID%20gt%202033')
	  .then(function(response) {
		  // Get the response body (JSON parsed or jQuery object for XMLs)
		 //console.log( response.getBody());
		 res.json(response.getBody());
	  });*/
});
app.delete("/alerts/:id",function(req,res)
{
	var id =req.params.id;
	console.log(id);
	requestify.delete('http://geofence.cloudapp.net/odata/Geofence?ID='+id)
	  .then(function(response) {
		consoloe.log("data");
		 res.json(response.getBody());
	  });
	/*db.alerts.remove({"_id":mongojs.ObjectId(id)},function(err,docs)
	{
		res.json(docs);
	});*/
});
app.get("/alerts/:id",function(req,res)
{
	var id =req.params.id;
	console.log(id);
	db.alerts.findOne({"_id":mongojs.ObjectId(id)},function(err,docs)
	{
		res.json(docs);
	});
});
app.listen(1234);