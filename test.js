const test = require("ava");
const axios = require("axios");
const config = require("./server").config;

test('my passing test', async t => {
    let url = `http://${config.iface}:${config.port}`;
	let result = await axios.get(url);
	t.truthy(result.data.length > 0)
});