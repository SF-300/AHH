import {tmpdir} from "os";
import {parse} from "url";
import Koa from "koa";


export const config = {
    isProduction: Boolean(process.env.NODE_ENV === "production"),
    iface: String(process.env.IFACE || "127.0.0.1"),
    port: Number(process.env.PORT || 3854),
    databaseUrl: String(process.env.DATABASE_URL || `sqlite://${tmpdir()}/ahh.sqlite`),
};


((async function main() {
    const koa = new Koa();

    if(!config.isProduction) {
        // NOTE(zeronineseven): https://basarat.gitbook.io/typescript/main-1/defaultisbad#dynamic-imports
        const koaWebpack = (await import("koa-webpack")).default;
        // @ts-ignore
        const webpackConfig = (await import("../../webpack.config.js")).default;
        koa.use(await koaWebpack({
            hotClient: false,
            config: {
                ...webpackConfig,
                mode: "development",
            }
        }));
    }

    koa.use(async ctx => {
        ctx.body = "Hello, Arkham Horror! We're expanding!";
    });

    koa.listen(config.port, config.iface);

})()).catch((e: Error) => {
    console.log(e);
    process.exit(1);
})
// const knex = (async () => {
//     let {protocol, auth, host, port, ...rest} = urlParse(config.databaseUrl);
//     let [user, password] = auth.split(":", 1);
//     let knex = require("knex")({
//         client: protocol,
//         connection: {
//             host: host,
//             port: port,
//             user: user,
//             password: password,
//             database: "ahh",
//         }
//     });
//     // await knex.
//     return knex;
// })()
