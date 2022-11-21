const Mock = require('mockjs')

const data = Mock.mock({
  'items|30': [{
    id: '@id',
    title: '@sentence(3, 5)',
    'status|1': ['成功', '停止', '失败', '运行'],
    'author|1': ['通用图谱', '系统技能', '通用QA', '自研ASR', '自研TTS'],
    display_time: '@datetime',
    pageviews: '@integer(0, 100)'
  }]
})

module.exports = [
  {
    url: '/smartest/table/list',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 200,
        data: {
          total: items.length,
          items: items
        }
      }
    }
  }
]
