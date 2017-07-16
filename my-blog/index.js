var path = require('path');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite');
var routes = require('./routes');
var pkg = require('./package');
var winston = require('winston');
var expressWinston = require('express-winston');

var app = express();

// 设置模板目录
app.set('views', path.join(__dirname, 'views'));
// 设置引擎为ejs
app.set('view engine', 'ejs');

// 设置文件静态目录
app.use(express.static(path.join(__dirname, 'public')));
// session中间件
app.use(session({
    name: config.session.key, //  设置cookie中保存session id 的字段名称
    secret: config.session.secret, //  通过设置secret来计算hash值并存在cookie中，产生的signedcookie防篡改
    resave: true, //  强制更新session
    saveUninitialized: false, // 设置为 false，强制创建一个 session，即使用户未登录
    cookie: {
        maxAge: config.session.maxAge //  过期时间，过期后cookie中的session自动删除
    },
    store: new MongoStore({ // 将session存储在mongodb中  
        url: config.mongodb // mongodb地址
    })
}));

//  flash 中间件，用来显示通知
app.use(flash());

// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img'),// 上传文件目录
  keepExtensions: true// 保留后缀
}));

//  设置模板全局变量
app.locals.blog = {
    title: pkg.name,
    descripion: pkg.descripion
};

//  添加模板必须要的三个变量
app.use(function(req, res, next){
    res.locals.user = req.session.user,
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});

//  路由
// 正常请求的日志
app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}));
// 路由
routes(app);
// 错误请求的日志
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}));

//  监听端口，启动程序
app.listen(config.port, function(){
    console.log(`${pkg.name} listening on port ${config.port}`);
});

// error page
app.use(function (err, req, res, next) {
  res.render('error', {
    error: err
  });
});

// 注意：中间件的加载顺序很重要。
// 如上面设置静态文件目录的中间件应该放到 routes(app) 之前加载，这样静态文件的请求就不会落到业务逻辑的路由里；
// flash 中间件应该放到 session 中间件之后加载，因为 flash 是基于 session 的。