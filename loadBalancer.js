var httpProxy = require("http-proxy");
var http = require('http');

var proxy = httpProxy.createProxyServer({});

var loadCounter=1;
var server=http.createServer( function (req, res){
	
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

});

server.listen(80);
