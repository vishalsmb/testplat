
var template = function(roll_number){
	return `<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css">
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js"></script>
  	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js"></script>
	<link rel="stylesheet" href="/loginsheet">
	<link rel="stylesheet" href="/indexsheet">
	<link href="https://fonts.googleapis.com/css?family=Alegreya+SC" rel="stylesheet">
	<link rel="stylesheet" href="/formsheet">
	<script src="/loginscript"></script>
</head>
<body>
	<center>
		<ul class="sidebar">
				<a href='/'><img src="/logo" style="padding-top:50px;width:200px;height:250px;"><img></a>
				<li id="sidebarlist"><a href="#" class="sidebarlink" onclick="load_events()" id="event_menu">EVENTS</a></li>
				<li id="sidebarlist"><a href="#" class="sidebarlink" onclick="logout()">LOGOUT</a></li>
		</ul>
		<div style="margin-left:25%;padding:1px 16px;" >
				<h1> GEEKSCOOP X9 </h1>
				<h2> Welcome, `+ roll_number + ` </h2>
				<div id="timer">
				</div>
				<div id="event">
				</div>
				
		</div>
	</center>
</body>
</html>
`;
}
module.exports = template;