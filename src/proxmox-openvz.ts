
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
        let prox = new Proxmox({
            username: configNode.credentials.username,
            password: configNode.credentials.password,
            hostname: configNode.host
        });

        node.on('input', async (msg) => {
            let data = await prox.storage.list();
            node.send({ payload: data })
        });

    }

    RED.nodes.registerType("proxmox-node", proxmoxNode);
}