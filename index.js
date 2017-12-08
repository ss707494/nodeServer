
const express = require('express');
const path = require('path');
const proxy = require('express-http-proxy');
const winston = require('winston'),
      expressWinston = require('express-winston');
const port = process.env.PORT || 8040;
const app = express();

const appPath = 'webapp';
const appName = 'react-app-ss';

0 && app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    })
  ],
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));

//豆瓣代理
app.use('/v2', proxy('https://api.douban.com/', {
    proxyReqPathResolver: function(req) {
      return require('url').parse('/v2/' + req.url).path;
    }
  }
));

//加载指定目录静态资源
app.use('/' + appName, express.static(__dirname + '/' + appPath))

//配置任何请求都转到index.html，而index.html会根据React-Router规则去匹配任何一个route
app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, appPath, 'index.html'))
})

app.listen(port, function () {
  console.log("server started on port " + port)
})

