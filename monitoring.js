var http = require('http');
var request = require('request');
var os = require('os');

var exec = require('child_process').exec;

// websocket server that website connects to.
var io = require('socket.io')(3000);


var nodeServers = 
[
	{url:"http://{{ hostvars['localhost']['image1_ipadd']}}:8080", latency: 0},
	{url:"http://{{ hostvars['localhost']['image2_ipadd']}}:8080", latency: 0},
	{url:"http://{{ hostvars['localhost']['image3_ipadd']}}:8080", latency: 0},
	{url:"http://{{ hostvars['localhost']['image4_ipadd']}}:8080", latency: 0},
	{url:"http://{{ hostvars['localhost']['image5_ipadd']}}:8080", latency: 0},
];


// Launch servers.
exec("node fastService.js");
exec("node mediumService.js");
exec("node slowService.js");

function memoryLoad()
{
	// console.log( os.totalmem(), os.freemem() );
	return 0;
}

// Create function to get CPU information
function cpuTicksAcrossCores() 
{
  //Initialise sum of idle and time of cores and fetch CPU info
  var totalIdle = 0, totalTick = 0;
  var cpus = os.cpus();
 
  //Loop through CPU cores
  for(var i = 0, len = cpus.length; i < len; i++) 
  {
		//Select CPU core
		var cpu = cpus[i];
		//Total up the time in the cores tick
		for(type in cpu.times) 
		{
			totalTick += cpu.times[type];
		}     
		//Total up the idle time of the core
		totalIdle += cpu.times.idle;
  }
 
  //Return the average Idle and Tick times
  return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
}

var startMeasure = cpuTicksAcrossCores();

function cpuAverage()
{
	var endMeasure = cpuTicksAcrossCores(); 
 
	//Calculate the difference in idle and total time between the measures
	var idleDifference = endMeasure.idle - startMeasure.idle;
	var totalDifference = endMeasure.total - startMeasure.total;
 
	//Calculate the average percentage CPU usage
	return 0;
}

function measureLatenancy(server)
{
	var options = 
	{
		url: server.url
	};
	var startTime = Date.now();
	console.log("request to url");
	request(options, function (error, res, body) 
	{
		if(error) {
			server.latency = 1001;
		}
		else{
		console.log( error || res.statusCode, server.url);
		server.latency = Date.now()-startTime;
		console.log(server.latency);
	}
	});

	return server.latency;
}

function calculateColor()
{
	// latency scores of all nodes, mapped to colors.
	var nodes = nodeServers.map( measureLatenancy ).map( function(latency) 
	{
		var color = "#cccccc";
		if( !latency )
			return {color: color};
		if( latency > 1000 )
		{
			color = "#ff0000";
		}
		else 
		{
			color = "#00ff00";
		}
		console.log( latency );
		return {color: color};
	});
	//console.log( nodes );
	return nodes;
}


io.on('connection', function (socket) {
	console.log("Received connection");

	///////////////
	//// Broadcast heartbeat over websockets
	//////////////
	var heartbeatTimer = setInterval( function () 
	{
		var data = { 
			name: "iTrust2 Monitoring", cpu: cpuAverage(), memoryLoad: memoryLoad()
			,nodes: calculateColor()
		};
		console.log("interval", data)
		//io.sockets.emit('heartbeat', data );
		socket.emit("heartbeat", data);
	}, 5000);

	socket.on('disconnect', function () {
		console.log("closing connection")
    	clearInterval(heartbeatTimer);
  	});
});










