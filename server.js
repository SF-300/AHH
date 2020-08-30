const Koa = require('koa');

const config = exports.config = {
    iface: process.env.IFACE || "127.0.0.1",
    port: process.env.PORT || 3854,
}

const app = new Koa();

app.use(async ctx => {
    ctx.body = "Hello, Arkham Horror! We're expanding!";
});

app.listen(config.port, config.iface);
