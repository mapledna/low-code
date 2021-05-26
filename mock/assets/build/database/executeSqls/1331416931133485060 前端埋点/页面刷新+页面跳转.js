/* 提交前端埋点记录：进入设计器时，页面刷新+页面跳转

API地址：api/build/database/executeSqls
参数：{"executeSqlList":[{"sqlId":"1331416931133485060","parameters":{}}]}

*/

const parameter = {
  executeSqlList: [
    {
      sqlId: '1331416931133485060',
      parameters: {
        start_time: 1614239629,
        end_time: 1614236276,
        duration_time: 3353,
        point_type: 4,
        point_name: '页面刷新',
        point_data:
          '当前页面：http://localhost:8080/designer.html#/?sessionKey=Bearer%20eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uS2V5IjoibnRpOmxvZ2luX2lkOmNoZW5qdW46cGMiLCJ1c2VyX25hbWUiOiJjaGVuanVuLXBjIiwic2NvcGUiOlsiYWxsIl0sImV4cCI6MTYxNDI4NzYyNSwicHJvZHVjdEtleSI6Im50aTp0b2tlbl91c2VyOmNoZW5qdW46cGMiLCJ1c2VySWQiOiI2NjY0MzM4ODE5NjE5MzYwNzY5IiwianRpIjoiZTBiNWUyN2QtMjc2ZS00NDNmLTliYTAtY2EzMzM0ZjU1ZWI5IiwiY2xpZW50X2lkIjoibnRpX2NsaWVudF9pZCIsInVzZXJuYW1lIjoiY2hlbmp1biIsInJlYWxuYW1lIjoi6ZmI54-6In0.lye1UJW3bF2b5Vt5VQe32qNt9bHa4vDna1HcGkz1-HdF7ybAcW9LFqTnvK8xkwicUwvnLzntaLGAAriRkz5K85i9qpUXoV87T8xWC7-yAymz6knP681zeu458sV8mJcNZ8DsQsFRlZ-yxvjlyajV7Jeowx2fd04mQNw-9lJgHOQ&partVersionId=1364826445972930561',
        pv_id: 0
      }
    },
    {
      sqlId: '1331416931133485060',
      parameters: {
        start_time: 1614239632,
        end_time: 1614239629,
        duration_time: 3,
        point_type: 1,
        point_name: '页面跳转',
        point_data:
          'from:/——to:/?sessionKey=Bearer%20eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uS2V5IjoibnRpOmxvZ2luX2lkOmNoZW5qdW46cGMiLCJ1c2VyX25hbWUiOiJjaGVuanVuLXBjIiwic2NvcGUiOlsiYWxsIl0sImV4cCI6MTYxNDI4NzYyNSwicHJvZHVjdEtleSI6Im50aTp0b2tlbl91c2VyOmNoZW5qdW46cGMiLCJ1c2VySWQiOiI2NjY0MzM4ODE5NjE5MzYwNzY5IiwianRpIjoiZTBiNWUyN2QtMjc2ZS00NDNmLTliYTAtY2EzMzM0ZjU1ZWI5IiwiY2xpZW50X2lkIjoibnRpX2NsaWVudF9pZCIsInVzZXJuYW1lIjoiY2hlbmp1biIsInJlYWxuYW1lIjoi6ZmI54-6In0.lye1UJW3bF2b5Vt5VQe32qNt9bHa4vDna1HcGkz1-HdF7ybAcW9LFqTnvK8xkwicUwvnLzntaLGAAriRkz5K85i9qpUXoV87T8xWC7-yAymz6knP681zeu458sV8mJcNZ8DsQsFRlZ-yxvjlyajV7Jeowx2fd04mQNw-9lJgHOQ&partVersionId=1364826445972930561',
        pv_id: 0
      }
    }
  ]
}

const result = {
  code: 0,
  data: {
    execute: [
      {
        code: 0,
        count: 1,
        dateTime: '2021-02-25 15:52:32',
        id: '1364845720766939138',
        msg: '创建成功',
        sqlId: '1331416931133485060'
      },
      {
        code: 0,
        count: 1,
        dateTime: '2021-02-25 15:52:32',
        id: '1364845720901156866',
        msg: '创建成功',
        sqlId: '1331416931133485060'
      }
    ]
  },
  message: 'success'
}

export default result
