var httpProxy = require("http-proxy");
var http = require('http');
var where=require('node-where');
var redis = require("redis")
var client = redis.createClient(6379, "{{ hostvars['localhost']['jenkins_ec2_ipadd']}}", {})


var proxy = httpProxy.createProxyServer({});
var alert=false;
var server=http.createServer( function (req, res){
	// console.log(req.headers['x-forwarded-for'] || req.connection.remoteAddress);
	
	var country,state
	where.is(req.connection.remoteAddress, function (err, result) {
		console.log(result);
		country=result.get('countryCode');
		state=result.get('regionCode');
		if (country == 'US' && state != 'NC')
			client.set("featureflag", "US");
		else if (country == 'US' && state == 'NC')
			client.set("featureflag", "NC");
		else
			client.set("featureflag", "Rest");

		if(!alert)
		{
			if(country!='US')
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
		}
		else
		{
			proxy.web(req, res, {target: "http://{{ hostvars['localhost']['checkbox_ec2_ipadd']}}"}, function (e){
				console.log(e);
			});
		}
		
	});
});

var checkStatus = setInterval(function () {
	try {
		http.get("http://{{ hostvars['localhost']['canary_ec2_ipadd']}}", function (res) {
			alert=false;
		}).on('error', function (e) {
			alert = true;
		});
	} catch (e) {
		alert = true;
	}
}, 5000);

server.listen(80);
