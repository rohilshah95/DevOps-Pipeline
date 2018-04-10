var httpProxy = require("http-proxy");
var http = require('http');

var proxy = httpProxy.createProxyServer({});
var alert=false;
var loadCounter=1;
var server=http.createServer( function (req, res){
	if(!alert)
	{
		if(loadCounter%3==0)
		{
			proxy.web(req, res, {target: 'http://{{canary_ip}}'}, function (e){
				proxy.web(req, res, {target: 'http://{checkbox_ip}'});
			});
		}
		else
		{
			proxy.web(req, res, {target: 'http://{{checkbox_ip}}'}, function (e){
				console.log(e);
			});
		}
		loadCounter++;
	}
	else
	{
		proxy.web(req, res, {target: 'http://{{checkbox_ip}}'}, function (e){
			console.log(e);
		});
	}
});

var checkStatus = setInterval(function () {
	try {
		http.get('http://{{canary_ip}}', function (res) {
			//Working fine
		}).on('error', function (e) {
			alert = true;
			clearInterval(checkStatus);
		});
	} catch (e) {
		alert = true;
	}
}, 5000);

server.listen(80);
