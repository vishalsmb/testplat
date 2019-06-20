var express = require('express');
var fs = require('fs');
var mysql = require('mysql');

var login = require('./login');
var register = require('./register');
var template = require('./template');
var test = require('./test');

var pool = mysql.createPool({
	connectionLimit : 10,
	host: "127.0.0.1",
	user: "root",
	password: "",
	database: "test"
});

var cssHeaders = {'Content-Type': 'text/css'};
var bodyParser = require('body-parser');
var session = require('express-session');
var bcrypt = require('bcrypt');
const saltRounds = 10;

var app = express()

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({secret:'ssshhhhh'}));
app.use('/login',login);
app.use('/register',register);
app.use('/test',test);
var sess;

app.get('/',function(req,res){
	var sess = req.session;
	console.log("caught the request");
	if(!sess.roll_number) {
		console.log("fetching the input file");
		res.sendFile(__dirname+'/views/index.html',{});
	}
	else {
		console.log("displaying the template file");
		res.send(template(sess.roll_number));
	}
});


app.get('/logout',function(req,res){
	if(req.session.roll_number) {
		req.session.destroy(function(err) {
			if(err) {
				res.send("Error in logging out");
			}
			else {
				fs.readFile("views/index.html",function(err,data){
					res.send(data);
					res.end();
				});
			}
		})
	}
	else {
		res.redirect('/');
	}
});

app.get('/logo',function(req,res){
	fs.readFile("geekscoop logo transparent.png",function(err,data){
		res.set('Content-Type','image/png');
		res.write(data);
		res.end();
	});
});

app.get('/loginsheet',function(req,res){
	fs.readFile("views/login.css",function(err,data){
		res.writeHead(200, cssHeaders);
		res.write(data);
		res.end();
	});
});

app.get('/indexsheet',function(req,res){
	fs.readFile("views/index.css",function(err,data){
		res.writeHead(200, cssHeaders);
		res.write(data);
		res.end();
	});
});
app.get('/formsheet',function(req,res){
	fs.readFile("views/form.css",function(err,data){
		res.writeHead(200,cssHeaders);
		res.write(data);
		res.end();
	});
});
app.get('/loginscript',function(req,res){
	fs.readFile("views/log.js",function(err,data){
		res.set('Content-Type','text/javascript');
		res.send(data);
	});
});

app.post('/saveresponse',function(req,res){
	res.send('done');
});

app.listen(3000,function(){
	console.log("Server listening on port 3000");
});





