var express = require('express');
var mysql = require('mysql');
var session = require('express-session');
var bcrypt = require('bcrypt');
var fs = require('fs');
var sqlstring = require('sqlstring');
var register = express.Router();
var sess;
var pool = mysql.createPool({
	connectionLimit : 10,
	host: "127.0.0.1",
	user: "root",
	password: "",
	database: "test"
});
const saltRounds = 10;
/* register.get('/',function(req,res){
	sess = req.session;
	if(sess.roll_number) {
		res.send("Logout and try again");
	}
	else {
		fs.readFile("views/register.html",function(err,data){
			if(err) res.end("File not found");
			res.write(data);
			res.end();
		});
	}
}); */
register.post('/',function(req,res){
	var roll_number = req.body.roll_number;
	var email = req.body.email;
	var name = req.body.name;
	var contact = req.body.contact;
	var year = req.body.year;
	var pass = req.body.pass;
	var access = "student";
	bcrypt.hash(pass,saltRounds,function(err,hash) {
		var sql = sqlstring.format("INSERT INTO gs_users VALUES (?,?,?,?,?,?,?)",[roll_number,name,email,contact,year,hash,access]);
		console.log(sql);
		pool.query(sql ,function (err, result, fields) {
			if (err) {
				console.log(err);
				res.send("Connection error");
			}
			else {
				res.send("Registered successfully");
			}
		});
	});
});
module.exports = register;