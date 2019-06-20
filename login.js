var express = require('express');
var session = require('express-session');
var mysql = require('mysql');
var bcrypt = require('bcrypt');
var template = require('./template');
var login = express.Router();
var fs = require('fs');
var sess;

var pool = mysql.createPool({
	connectionLimit : 10,
	host: "127.0.0.1",
	user: "root",
	password: "",
	database: "test"
});

const saltRounds = 10;

login.get('/',function(req,res){
	sess = req.session;
	if(sess.roll_number) {
		res.send(template());
	}
	else {
		res.redirect('/');
	}
})

login.post('/',function(req,res){
	var roll_number = req.body.roll_number;
	var pass = req.body.pass;
	console.log(roll_number+"----------------"+pass);
	var sql = "SELECT * FROM gs_users WHERE roll_number = "+mysql.escape(roll_number);
	
		
		
		pool.query(sql , function (err, result, fields) {
			if (err) {
				res.send(err);
				console.log(err);
			}
			else if(result[0]) {
				var dpass = result[0].password.toString();
				bcrypt.compare(pass,dpass,function(err,response) {
					if(response) {
						sess = req.session;
						sess.roll_number = roll_number;
						res.send(template(roll_number));
					}
					else {
						res.send("Error");
					}
				})
			}
			else {
				res.send("Invalid credentials or no record exists");
			}
		});
		
})

module.exports = login;