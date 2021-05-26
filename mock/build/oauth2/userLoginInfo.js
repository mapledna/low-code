/* 用户信息请求【登录后第一个】
特征：

API地址：api/build/oauth2/userLoginInfo
参数：{}
*/

// Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uS2V5IjoibnRpOmxvZ2luX2lkOmNoZW5qdW46cGMiLCJ1c2VyX25hbWUiOiJjaGVuanVuLXBjIiwic2NvcGUiOlsiYWxsIl0sImV4cCI6MTYxNjA0MDE4NSwicHJvZHVjdEtleSI6Im50aTp0b2tlbl91c2VyOmNoZW5qdW46cGMiLCJ1c2VySWQiOiI2NjY0MzM4ODE5NjE5MzYwNzY5IiwianRpIjoiNzIxNzY5MDUtNWRkZS00NTEzLWFmN2YtYzFhNWVkZWY4Y2Y3IiwiY2xpZW50X2lkIjoibnRpX2NsaWVudF9pZCIsInVzZXJuYW1lIjoiY2hlbmp1biIsInJlYWxuYW1lIjoi6ZmI54-6In0.iQjuj-wLtDnKa7ObnMGrDvSIJWdw27nuvJ-RWqG7HJQ5oNiXlGYx7QS92tI8mFj5etWk1ZAkE92_5iGRmL_rTk89Zji0VjWkNrt7owTLb5kLrPz3zAhon7wkq7uLcN3dwm4WcGloioZWVNFz6LXH5t7xtYJj-nPmq8EF8hH-z84
// Cookie: sessionKey=b081a056-ca2b-49a6-88f3-b776d63aabfa

const parameter = {}

const result = {
  code: 0,
  data: {
    clientId: '1',
    clientName: '开发者配置化平台',
    clientShortName: '开发者平台',
    loginIp: '127.0.0.1, 117.30.207.89,172.18.190.58',
    productCode: 'prod',
    productName: '配置平台',
    userName: '陈珺'
  },
  message: '查询成功'
}

export default result
