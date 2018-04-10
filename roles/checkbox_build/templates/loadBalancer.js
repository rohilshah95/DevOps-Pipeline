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
			proxy.web(req, res, {target: "http://{{ hostvars['localhost']['canary_ec2_ipadd']}}"}, function (e){
				proxy.web(req, res, {target: "http://{{ hostvars['localhost']['checkbox_ec2_ipadd']}}"});
			});
		}
		else
		{
			proxy.web(req, res, {target: "http://{{ hostvars['localhost']['checkbox_ec2_ipadd']}}"}, function (e){
				console.log(e);
			});
		}
		loadCounter++;
	}
	else
	{
		proxy.web(req, res, {target: "http://{{ hostvars['localhost']['checkbox_ec2_ipadd']}}"}, function (e){
			console.log(e);
		});
	}
});

var checkStatus = setInterval(function () {
	try {
		http.get("http://{{ hostvars['localhost']['canary_ec2_ipadd']}}", function (res) {
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
