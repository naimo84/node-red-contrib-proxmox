
import { Red, Node } from 'node-red';
import { Proxmox } from '@naimo84/proxmox';

module.exports = function (RED: Red) {
    function proxmoxNode(config: any) {
        RED.nodes.createNode(this, config);
        let configNode = RED.nodes.getNode(config.confignode) as any;
        // if (!configNode) {
        //     this.error("Config is missing!")
        //     return;
        // }
        let node = this;
        let prox = new Proxmox(configNode.credentials.username, configNode.credentials.password, configNode.host);
        // node.config = configNode;
        node.on('input', async (msg) => {
            let data = await prox.storage.list(null);
            node.send({ payload: data })
        });

    }

    RED.nodes.registerType("proxmox-node", proxmoxNode);
}