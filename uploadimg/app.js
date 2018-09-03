const Koa = require('koa2');
const router = require('koa-router')();
const request = require('request');
var bodyParser = require('koa-bodyparser');
// 获取本机ip
var os = require('os');
var ip = showObj(os.networkInterfaces());
var app = new Koa();
app.use(bodyParser());
router.post('/img_list', async function (ctx, next) {
    if (ctx.request.method === 'POST') {
        function getPostFun(respones) {
            return respones.request.body || {}
        }
        var get_post = await getPostFun(ctx)
        // ctx.body = get_post;
        await new Promise(function (resolve, reject) {
            var req = request({
                method: 'POST',
                encoding: null,
                data: get_post,
                uri: 'http://47.104.164.7:3002/'
            }, function (err, response, body) {
                // console.log(response)
                if (err) {
                    return reject(err);
                }
                resolve(body);
            });
        }).then((body) => {
            ctx.body = `${body}返回的参数`;
        }).catch((err) => {
            console.error(err);
        });
    }

});
// 静态文件目录
app.use(require('koa-static')(__dirname));
app.use(router.routes());

app.listen(8080, function () {
    console.log(`server at: http://${ip}:8080`)
});


function showObj(obj) {
    for (var devName in obj) {
        var iface = obj[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}
