var express = require('express');
var test = express.Router();
var mysql = require('mysql');
var sqlstring = require('sqlstring');
var pool = mysql.createPool({
	connectionLimit : 10,
	host: "127.0.0.1",
	user: "root",
	password: "",
	database: "test"
});
var sess;

test.get('/',function(req,res){
	sess = req.session;
	if(sess.roll_number){
		var available = "SELECT event_name,status from statistics where student = ?";
		var available_query = sqlstring.format(available,[sess.roll_number]);
		pool.query(available_query,function(err,result,fields){
			var event_status = "[";
			var event_names="[";
			if(result) {
				for(i=0;i<result.length;i++)
				{
					if(i+1 == result.length) {
						event_names += `"` +result[i].event_name.toString()+`"`;
						event_status += `"` + result[i].status.toString()+`"`;
					}
					else {
						event_names += `"` +result[i].event_name.toString()+`",`;
						event_status += `"` + result[i].status.toString()+`",`;
					}
				}
				total_events = result.length;
				event_names += ']';
				event_status += ']';
					
			}
			res.setHeader("Content-type","application/json");
			
			res.send(`{"total_events":`+total_events+`,"event_names":`+event_names+`,"event_status":`+event_status+`}`);
		})	
	}
	else {
		res.send("Login and try again");
	}
});
	
test.get('/start/:event_name',function(req,res){
	if(req.session.roll_number) {
		var event_name = req.params.event_name;
		var tq = "SELECT q_num,question,a,b,c,d from questions where event = ?";
		var iq = "UPDATE statistics set status = 'attending' where student = ?";
		var dq = "UPDATE statistics set end_time = ? where student = ?";
		var test_query = sqlstring.format(tq,[event_name]);
		var intimate_query = sqlstring.format(iq,[req.session.roll_number]);
		var d = new Date();
		var d1 = new Date(d);
		d1.setMinutes(d1.getMinutes()+60);
		var deadline_query =  sqlstring.format(dq,[d1,req.session.roll_number]);
		console.log(deadline_query);
		pool.query(intimate_query,function(err,result,fields) {
			if(result) {
				pool.query(deadline_query,function(err,result,fields) {
					if(result) {
						pool.query(test_query,function(err,result,fields){
							var questions;
							if(result) {
								console.log(result);
								questions = JSON.stringify(result);
								res.setHeader("Content-type","application/json");
								res.send(questions);
							}
						});
					}
				});
			}
			else {
				res.send("Error in processing");
			}
		});
	}
	
});

test.get('/resume/:event_name',function(req,res){
	if(req.session.roll_number) {
		var event_name = req.params.event_name;
		var tq = "SELECT q_num,question,a,b,c,d from questions where event = ?";
		var test_query = sqlstring.format(tq,[event_name]);
		pool.query(test_query,function(err,result,fields){
			var questions;
				if(result) {
					console.log(result);
					questions = JSON.stringify(result);
					res.setHeader("Content-type","application/json");
					res.send(questions);
				}
		});
	}
	else {
		res.send("Error in processing");
	}
});
test.get('/gettime/:event_name',function(req,res){
		if(req.session.roll_number) {
			var event_name = req.params.event_name;
			var query = 'SELECT DATE_FORMAT(end_time,"%a %b %e %Y %H:%i:%s") as end_time from statistics where student = ? and event_name = ?';
			var tq = sqlstring.format(query,[req.session.roll_number,event_name]);
			console.log(tq);
			pool.query(tq,function(err,result,fields){
				if(result) {
					var time = JSON.stringify(result);
					console.log(time);
					res.send(time);
				}
			})
		}
		else {
			res.send("Login and try again");
		}
})

		
module.exports = test;


