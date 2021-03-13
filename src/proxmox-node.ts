
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
        node.action = config.action

        node.on('input', (msg, send, done) => {
            node.node = RED.util.evaluateNodeProperty(config.node, config.nodetype, node, msg);
            processInput(node, send, done, prox)
        });

        async function processInput(node, send, done, prox: Proxmox) {
            let data = {};
            if (node.action === 'getFinishedTasks') {
                data = await prox.node.getFinishedTasks(node.node);
            }

            send({ payload: data })
            done()
        }
    }

    RED.nodes.registerType("proxmox-node", proxmoxNode);
}