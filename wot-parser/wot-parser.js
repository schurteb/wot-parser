module.exports = function(RED) {
    function WotParserNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
		
        this.on('input', function(msg) {
			var rawData = '';
			var parsedData = '';
			
			http_get(config.url_host, config.url_port, config.url_path, http_get_callback);
			
			function http_get(host, port, path, callback)
			{
				var http = require('http');

				var options = {
				  host: host,
				  port: port,
				  path: path
				};

				http.get(options, callback);
			}
			
			function http_get_callback(response) {
				response.on('data', (chunk) => {
					try
					{
						rawData += chunk;
					}
					catch (e) {
						msg.payload = e;
						node.send(msg);
					}
				});
				response.on('end', () => {
					try {
						msg.payload = JSON.parse(rawData);
						node.send(msg);
					} catch (e) {
						msg.payload = e;
						node.send(msg);
					}
				});
			}
        });
    }
	
    RED.nodes.registerType("WoT-Parser", WotParserNode);
}