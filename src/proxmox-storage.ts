
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

        node.action = config.action;

        node.on('input', async (msg, send, done) => {
            node.data = RED.util.evaluateNodeProperty(config.data, config.datatype, node, msg);
            node.storage = RED.util.evaluateNodeProperty(config.storage, config.storagetype, node, msg);

            processInput(node, send, done, prox)
        });

        async function processInput(node, send, done, prox: Proxmox) {
            let data = {};
            if (!node.action || node.action === 'get') {
                data = await prox.storage.list();
            } else if (node.action === 'enable') {
                let storage = mergeDeep(await prox.storage.get(node.storage), { data: node.data });
                delete storage.data.datastore;
                delete storage.data.type;
                delete storage.data.server;

                data = await prox.storage.update(node.storage, storage.data);
            }

            send({ payload: data })
            done()
        }

    }

    RED.nodes.registerType("proxmox-storage", proxmoxNode);
}