
import { Red, Node } from 'node-red';
import { Proxmox } from '@naimo84/proxmox';
import { mergeDeep } from './helper'

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


        node.on('input', async (msg, send, done) => {
            node.data = RED.util.evaluateNodeProperty(config.data, config.datatype, node, msg);
            node.storage = RED.util.evaluateNodeProperty(config.storage, config.storagetype, node, msg);

            processInput(node, send, done, prox)
        });
    }

    async function processInput(node, send, done, prox: Proxmox) {
        let data = {};
        if (!node.action || node.action === 'get') {
            data = await prox.backup.list();
        } else if (node.action === 'vzdump') {
            await prox.node.vzdump(node.node, node.data);
        }

        send({ payload: data })
        done()
    }



    RED.nodes.registerType("proxmox-backup", proxmoxNode);
}