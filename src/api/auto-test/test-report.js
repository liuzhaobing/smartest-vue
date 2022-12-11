import request from '@/utils/request'

export function findResults(payload) {
  return request({
    url: '/api/v1/reports',
    method: 'post',
    data: payload
  })
}

export function aggregateResults(payload) {
  return request({
    url: '/api/v1/reports/aggregate',
    method: 'post',
    data: payload
  })
}

export function exportResults(payload) {
  return request({
    url: `/api/v1/reports/export`,
    method: 'post',
    data: payload
  })
}
