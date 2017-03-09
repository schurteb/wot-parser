module.exports = function(RED) {
	/**
	 * Represents a node of type 'WoT-Parser'.
	 * @param {config} config - The node-configuration.
	 */
    function WotParserNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
		
        this.on('input', function(msg) {
			var rawData = '';
			var parsedData = '';
			
			// reset status to normal
			node.status({});
			
			http_get(config.url_host, config.url_port, config.url_path, http_get_callback);
			
			/**
			 * Does an async http-request (GET-method)
			 * @param {string} host - The host of the website requested.
			 * @param {int} port - The port to use for the query (default HTTP is 80).
			 * @param {string} path - The path where to search for data if it is not at the mainpage.
			 * @param {function} callback - The callback-function which gets called when the request completed.
			 */
			function http_get(host, port, path, callback)
			{
				var http = require('http');

				var options = {
				  host: host,
				  port: port,
				  path: path
				};

				var request = http.get(options, callback);
					
				request.on('error', function(exception) {
					// handle errors like ECONNREFUSED
					node.error(exception.message);
					node.status({fill:"red",shape:"ring",text:exception.message});
					request.abort();
				});
			}
			
			/**
			 * Handles the request's response
			 * @param {http.IncomingMessage} response - The response from the http-request.
			 */
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