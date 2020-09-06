import test from "ava";
import axios from "axios";
import {config} from "server"

test('my passing test', async t => {
    let url = `http://${config.iface}:${config.port}`;
	let result = await axios.get(url);
	t.truthy(result.data.length > 0)
});