
import { Red, Node } from 'node-red';
import { Proxmox } from '@naimo84/proxmox';

module.exports = function (RED: Red) {
    function proxmoxNode(config: any) {
        RED.nodes.createNode(this, config);
        let configNode = RED.nodes.getNode(config.confignode) as any;

        let node = this;
        let prox = new Proxmox(configNode.credentials.username, configNode.credentials.password, configNode.host);
        configNode.action = config.action;
        configNode.qemuId = config.qemuId;
        configNode.node = config.node;
       
        node.on('input', async (msg, send, done) => {
            processInput(node, configNode, send, done, prox)
        });
    }

    async function processInput(node, config, send, done, prox: Proxmox) {
        let data = {};
        if (config.action === 'shutdown') {
            data = await prox.qemu.shutdown(config.node, config.qemuId);
        } else if (config.action === 'start') {
            data = await prox.qemu.start(config.node, config.qemuId);
        } else {
            data = await prox.qemu.getStatusCurrent(config.node, config.qemuId);
        }
        send({ payload: data })
        done()
    }

    RED.nodes.registerType("proxmox-qemu", proxmoxNode);
}