import request from '@/utils/request'

export function getCasesData(tp, params) {
  return request({
    url: `/api/v1/cases/${tp}`,
    method: 'get',
    params: params
  })
}

export function getCasesIncreaseTendencyData(tp, month) {
  return request({
    url: `/api/v1/cases/${tp}/total/weekly`,
    method: 'get',
    params: { month: month }
  })
}

export function getPortionOfOneColumn(tp, column) {
  return request({
    url: `/api/v1/cases/${tp}/count/${column}`,
    method: 'get'
  })
}

