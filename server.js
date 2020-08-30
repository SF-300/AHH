const Koa = require('koa');


const app = new Koa();

app.use(async ctx => {
    ctx.body = 'Hello, Arkham Horror!';
});

app.listen(3000);
