const {
  result: DS_SQL_CATEGORY_LIST
} = require('../assets/build/database/executeSqls/4/DS_SQL_CATEGORY_LIST.js')
const {
  result: DS_DICT_LIST
} = require('../assets/build/database/executeSqls/DS_DICT_LIST.js')
const {
  result: DS_FLOW_CATEGORY_LIST
} = require('../assets/build/database/executeSqls/DS_FLOW_CATEGORY_LIST.js')
const {
  result: DS_PAGE_LIST
} = require('../assets/build/database/executeSqls/DS_PAGE_LIST.js')
const {
  result: SERIAL_NUMBER
} = require('../assets/build/database/executeSqls/流水号.js')
const { formatReturn } = require('../config')

const {
  result: DS_SQL_CATEGORY_1257903494026915842
} = require('../assets/build/database/executeSqls/5/DS_SQL_CATEGORY_1257903494026915842 分类管理.js')
const {
  result: DS_SQL_CATEGORY_1257904396855046146
} = require('../assets/build/database/executeSqls/5/DS_SQL_CATEGORY_1257904396855046146 接口管理.js')
const {
  result: DS_SQL_CATEGORY_1274971089329876994
} = require('../assets/build/database/executeSqls/5/DS_SQL_CATEGORY_1274971089329876994 SQL参数.js')

const {
  result: run1251047719744778242
} = require('../assets/build/database/executeSqls/6/1251047719744778242 获取接口服务表.js')

const {
  result: queryList
} = require('../assets/build/database/executeSqls/1255778887614492674 查询服务分类表列表.js')

const {
  result: designData1255778887614492674
} = require('../assets/build/database/generator/designData 获取数据源配置信息/1255778887614492674 查询服务分类表列表.js')
const {
  result: designData1251047719744778242
} = require('../assets/build/database/generator/designData 获取数据源配置信息/1251047719744778242 获取接口服务表.js')
const {
  result: designData1251047719744778243
} = require('../assets/build/database/generator/designData 获取数据源配置信息/1251047719744778243 插入接口服务表.js')
const {
  result: designData1251047719744778244
} = require('../assets/build/database/generator/designData 获取数据源配置信息/1251047719744778244 编辑接口服务表.js')

const executeSqlsMap = {
  '4_{"service_type":6}': DS_SQL_CATEGORY_LIST,
  '4_{"service_type":""}': {},
  '1255702349277270017': DS_DICT_LIST,
  '1265130884821331975': DS_FLOW_CATEGORY_LIST,
  // '1265130884821331975': [],
  '1264753294889603073': DS_PAGE_LIST,
  '1270224820225093633': SERIAL_NUMBER,

  '5_{"category_id":"1257903494026915842"}': DS_SQL_CATEGORY_1257903494026915842,
  '5_{"category_id":"1257904396855046146"}': DS_SQL_CATEGORY_1257904396855046146,
  '5_{"category_id":"1274971089329876994"}': DS_SQL_CATEGORY_1274971089329876994,

  '6_{"sqlId":"1251047719744778242"}': run1251047719744778242,

  '1257968258652504065_{"p_id":"1261170088084930561"}': {},

  '1282980172343468034': queryList // 查询服务分类表列表

}

const designDataMap = {
  '1255778887614492674': designData1255778887614492674,
  '1251047719744778242': designData1251047719744778242,
  '1251047719744778243': designData1251047719744778243,
  '1251047719744778244': designData1251047719744778244
}

module.exports = [
  {
    url: '/api/build/database/executeSqls',
    type: 'post',
    response: config => {
      const { executeSqlList } = config.body
      const list = executeSqlList.map(({ sqlId, parameters }) => {
        const key = !parameters || JSON.stringify(parameters) === '{}'
          ? sqlId
          : `${sqlId}_${JSON.stringify(parameters)}`
        console.log('database/executeSqls key', key, executeSqlsMap[key])
        return executeSqlsMap[key]
      })
      return list?.[0] || {}
      // return formatReturn(list[0])
    }
  },
  {
    url: '/api/build/database/generator/designData',
    type: 'post',
    response: config => {
      const { sourceId, sourceType } = config.body
      const list = designDataMap[sourceId]
      console.log('enerator/designData sourceId', sourceId, list)
      return list
      // return formatReturn(list[0])
    }
  }
]
