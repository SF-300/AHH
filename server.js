const Koa = require('koa');

const config = {
    port: process.env.PORT || 3854,
}

const app = new Koa();

app.use(async ctx => {
    ctx.body = 'Hello, Arkham Horror!';
});

app.listen(config.port);
