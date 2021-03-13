
import { Red, Node } from 'node-red';
import { Proxmox } from '@naimo84/proxmox';

module.exports = function (RED: Red) {
    function proxmoxNode(config: any) {
        RED.nodes.createNode(this, config);
        let configNode = RED.nodes.getNode(config.confignode) as any;

        let node = this;
        let prox = new Proxmox({
            username: configNode.credentials.username,
            password: configNode.credentials.password,
            hostname: configNode.host
        });

        node.action = config.action;
        node.qemuId = config.qemuId;
        node.node = config.node;
       
        node.on('input', async (msg, send, done) => {
            processInput(node, send, done, prox)
        });
    }

    async function processInput(node, send, done, prox: Proxmox) {
        let data = {};
        if (node.action === 'shutdown') {
            data = await prox.qemu.shutdown(node.node, node.qemuId);
        } else if (node.action === 'start') {
            data = await prox.qemu.start(node.node, node.qemuId);
        } else {
            data = await prox.qemu.getStatusCurrent(node.node, node.qemuId);
        }
        send({ payload: data })
        done()
    }

    RED.nodes.registerType("proxmox-qemu", proxmoxNode);
}