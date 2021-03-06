/**
 * 用于处理静态资源的 middleware
 */
const path = require('path');
const mime = require('mime');
const fs = require('mz/fs');

// url: 类似 '/static/'
// dir: 类似 __dirname + '/static'
function staticFiles(url, dir) {

    return async (ctx, next) => {
        let rpath = ctx.request.path;
        // 判断是否以指定的url开头
        if (rpath.startsWith(url)) {
            // 获取文件完整路径
            let fp = path.join(dir, rpath.substring(url.length));
            console.log('------------');
            console.log(`dir is ${dir} - \nurl is ${url} & url.length is ${url.length} - \nrpath is ${rpath} - \nso fp is ${fp}`);
            // 判断文件是否存在
            if (await fs.exists(fp)) {
                // 查找文件的mime
                ctx.response.type = mime.lookup(rpath);
                // 读取文件内容并复制给response.body
               ctx.response.body = await fs.readFile(fp);
            } else {
                // 文件不存在
                console.log('文件不存在');
                ctx.response.status = 404;
            }
        } else {
            // 不是制动前缀的URL，继续处理下一个middleware
            console.log(`\nurl is ${url}，不是制动前缀的URL`);
            await next();
        }
    }
}

module.exports = staticFiles;