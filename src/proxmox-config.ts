

module.exports = function (RED: any) {
    function config(config) {
        var node = this;
        RED.nodes.createNode(node, config);

        node.host = config.host;
        node.name = config.name;
    }

  

    RED.nodes.registerType("proxmox-config", config, {
		credentials: {
			password: { type: 'password' },
			username: { type: 'text' }
		}
	});
}