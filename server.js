const Koa = require('koa');

const config = {
    port: process.env.PORT || 3854,
}

const app = new Koa();

app.use(async ctx => {
    ctx.body = "Hello, Arkham Horror! We're expanding!";
});

app.listen(config.port);
