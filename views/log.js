	var modal = document.getElementById('id01');
	window.onclick = function(event) {
			if (event.target == modal) {
				modal.style.display = "none";
			}
		}

		
function login()
{
	document.getElementById("loginbutton").innerHTML = "Please wait";	
		
		
	var roll_number = document.getElementById("roll_number").value;
	var pass = document.getElementById("pass").value;
	var query ="roll_number="+roll_number+"&pass="+pass;
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			if(this.responseText == "Error") {
				alert("check your input details");
			}
			else if(this.responseText =="Invalid credentials or no record exists"){
				document.body.innerHTML = this.responseText;
			}
			else if(this.responseText == "Connection error") {
				document.body.innerHTML = this.responseText;
			}
			else {
				document.body.innerHTML = this.responseText;
			}
		}
	}
	xhttp.open("POST","/login",true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(query);
	document.getElementById("loginbutton").innerHTML = "Login";

	
}	

function register()
{
	document.getElementById("registerbutton").innerHTML = "Please wait";
	var roll_number = document.getElementById("roll_number1").value;
	var name = document.getElementById("name").value;
	var email = document.getElementById("email").value;
	var contact = document.getElementById("contact").value;
	var year = document.getElementById("year").value;
	var pass = document.getElementById("pass1").value;
	var query ="roll_number="+roll_number+"&pass="+pass+"&email="+email+"&contact="+contact+"&year="+year+"&name="+name;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			if(this.responseText == "Connection error") {
				alert("check your input details");
				document.getElementById("registerbutton").innerHTML = "Register";
			}
			else {
				alert("You have been registered");
				document.getElementById("registerbutton").innerHTML = "Register";
			}
		}
	}
	xhttp.open("POST","/register",true);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhttp.send(query);
}	

function load_events(){
			var xhttp = new XMLHttpRequest();
			document.getElementById("event_menu").style = "background-color: #0F3955;color: white;";
			
			xhttp.onreadystatechange = function() {
				if(this.readyState == 4 && this.status == 200) {
					var content = JSON.parse(this.responseText);
					var template = "<div class='table-responsive' ><table class='table table-striped table-hover'> <thead class='thead-dark'><tr> <th> S.NO </th> <th> Event name </th> <th> Status </th> </tr></thead> <tbody>";
					for(i=0;i<parseInt(content.total_events);i++)
					{
						if(content.event_status[i] == "not attended") {
							template += "<tr><td>"+(i+1)+"</td><td>"+content.event_names[i]+"</td><td><button onclick='start_test(`"+content.event_names[i]+"`)'>Start</button></td></tr>";
						}
						else if(content.event_status[i] == "attended") {
							template += "<tr><td>"+(i+1)+"</td><td>"+content.event_names[i]+"</td><td><button onclick='#'>View submission</button></td></tr>";
						}
						else if(content.event_status[i] == "attending") {
							template += "<tr><td>"+(i+1)+"</td><td>"+content.event_names[i]+"</td><td><button onclick='resume_test(`"+content.event_names[i]+"`)'>Resume</button></td></tr>";
						}
					}
					template += "</tbody></table></div>";
					document.getElementById("event").innerHTML = template;
				}
			}
			xhttp.open("GET","/test",true);
			xhttp.send();
		}
	
function logout(){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200){
			document.body.innerHTML = this.responseText;
		}
	}
	xhttp.open("GET","/logout",true);
	xhttp.send();
}
var content;
var length;
function start_test(event_name) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200){
			content = JSON.parse(this.responseText);
			length = content.length;
			timer(event_name);
			conduct_test_forward();
		}
	}
	var request = "/test/start/"+event_name;
	xhttp.open("GET",request,true);
	xhttp.send();
}

function resume_test(event_name) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200){
			content = JSON.parse(this.responseText);
			length = content.length;
			timer(event_name);
			conduct_test_forward();
		}
	}
	var request = "/test/resume/"+event_name;
	xhttp.open("GET",request,true);
	xhttp.send();
}
var counter = -1;

function timer(event_name) {
	var time;
	var abc;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			time = JSON.parse(this.responseText);
			abc = time[0].end_time;
			var countDownDate = new Date(abc).getTime();
			console.log(countDownDate);
			// Update the count down every 1 second
			var x = setInterval(function() {

				// Get todays date and time
				var now = new Date().getTime();
				
				// Find the distance between now and the count down date
				var distance = countDownDate - now;
				console.log(distance);
				// Time calculations for days, hours, minutes and seconds
				var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
				var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
				var seconds = Math.floor((distance % (1000 * 60)) / 1000);
				
				// Output the result in an element with id="demo"
				document.getElementById("timer").innerHTML = hours+':'+minutes+':'+seconds;
				
				// If the count down is over, write some text 
				if (distance < 0) {
					clearInterval(x);
					document.getElementById("timer").innerHTML = "";
					document.getElementById("event").innerHTML = "Thanks for taking the test";
				}
			}, 1000);
		}
	}
	var request = "/test/gettime/"+event_name;
	xhttp.open("GET",request,true);
	xhttp.send();
}
function conduct_test_forward() {
	console.log("counter : " + counter );
	if(counter == -1) {
		counter += 1;
		var question = "<form><h2>"+content[counter].question+"</h2><input type='radio' name='option' value='a'>"+content[counter].a+"<br/><input type='radio' name='option' value='b'>"+content[counter].b+"<br/><input type='radio' name='option' value='c'>"+content[counter].c+"<br/><input type='radio' name='option' value='d'>"+content[counter].d+"<br/>";
		question += "<button class='col-sm-2' onclick = 'saveresponse()'>save response</button></form>  <button class='col-sm-2' onclick='conduct_test_forward()'>next</button>";
		document.getElementById("event").innerHTML = question;
	}
	else if(counter > -1 && counter < length-1) {
		counter += 1;
		if(counter != length-1) {
			var question = "<form><h2>"+content[counter].question+"</h2><input type='radio' name='option' value='a'>"+content[counter].a+"<br/><input type='radio' name='option' value='b'>"+content[counter].b+"<br/><input type='radio' name='option' value='c'>"+content[counter].c+"<br/><input type='radio' name='option' value='d'>"+content[counter].d+"<br/>";
			question += "<button class='col-sm-2' onclick = 'saveresponse()'>save response</button></form> <button class='col-sm-2' onclick='conduct_test_backward()'>previous</button><button class='col-sm-2' onclick='conduct_test_forward()'>next</button>";
			document.getElementById("event").innerHTML = question;
		}
	}
	if(counter == length-1) {
		var question = "<form><h2>"+content[counter].question+"</h2><input type='radio' name='option' value='a'>"+content[counter].a+"<br/><input type='radio' name='option' value='b'>"+content[counter].b+"<br/><input type='radio' name='option' value='c'>"+content[counter].c+"<br/><input type='radio' name='option' value='d'>"+content[counter].d+"<br/>";
		question += "<button class='col-sm-2' onclick = 'saveresponse()'>save response</button></form> <button class='col-sm-2' onclick='conduct_test_backward()'>previous</button> ";
		document.getElementById("event").innerHTML = question;
	}
	console.log("counter at the end: " + counter );
}

function conduct_test_backward() {
	console.log("counter : " + counter );
	if(counter > 0) {
		counter -= 1;
		if(counter != 0) {
			var question = "<form><h2>"+content[counter].question+"</h2><input type='radio' name='option' value='a'>"+content[counter].a+"<br/><input type='radio' name='option' value='b'>"+content[counter].b+"<br/><input type='radio' name='option' value='c'>"+content[counter].c+"<br/><input type='radio' name='option' value='d'>"+content[counter].d+"<br/>";
			question += "<button class='col-sm-2' onclick = 'saveresponse()'>save response</button></form> <button class='col-sm-2' onclick='conduct_test_backward()'>previous</button>  <button class='col-sm-2' onclick='conduct_test_forward()'> next </button>";
			document.getElementById("event").innerHTML = question;
		}
	}
	if(counter == 0) {
		var question = "<form method='POST' action='/saveresponse'><h2>"+content[counter].question+"</h2><input type='radio' name='option' value='a'>"+content[counter].a+"<br/><input type='radio' name='option' value='b'>"+content[counter].b+"<br/><input type='radio' name='option' value='c'>"+content[counter].c+"<br/><input type='radio' name='option' value='d'>"+content[counter].d+"<br/>";
		question += "<button class='col-sm-2' onclick = 'saveresponse()'>save response</button></form> <button onclick='conduct_test_forward()' class='col-sm-2'>next</button>";
		document.getElementById("event").innerHTML = question;
	}
	console.log("counter at the end: " + counter );
}
