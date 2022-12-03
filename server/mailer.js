const nodemailer = require('nodemailer');
const express = require('express');
const bodyParser = require('body-parser');

// 初始化邮件发送
const transporter = nodemailer.createTransport({
  host: 'smtpdm.aliyun.com',
  port: 465,
  secureConnection: true,
  auth: {
    user: 'example@example.com', // user name
    pass: 'xxxxxx', // password
  },
});

// 邮件参数
const mailOptions = (toEmail, toContent, atUrl) => {
  return {
    from: 'Nexment<example@example.com>', // sender address mailfrom must be same with the user
    to: toEmail, // list of receivers
    replyTo: 'example@example.com',
    subject: '[Notification] You have a new reply on Nexment', // Subject line
    html: `
        <div>
          <h1>Notification</h1>
          <p>You have a new reply on Nexment</p>
          <br/>
          <div>${toContent}</div>
          <br/>
          <div><a href="${atUrl}">Visit →</a></div>
        </div>`, // html body
  };
};

//新建 Express 实例
var app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// 允许跨域
app.use(function(_req, res, next) {
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('x-powered-by', 'Love');
  res.header('Cache-Control', 'No-store');
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// 处理请求
app.post('/send/mail', function(req, res) {
  //获取请求参数
  const params = req.query;

  // 发送邮件
  transporter.sendMail(
    mailOptions(params.toEmail, params.toContent, params.atUrl),
    function(error) {
      if (error) {
        res.json({
          params: params,
          error: error,
          msg: 'Mail sending error',
        });
      } else {
        res.json({
          msg: 'Mail sent',
        });
      }
    }
  );
});

// 部署服务
app.listen(process.env.PORT || 2233, function() {
  console.log(`Mailer app is listening at port ${process.env.PORT || 2233}`);
});
