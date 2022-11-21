import request from '@/utils/request'

export function addPlan(data) {
  return request({
    url: '/api/v1/plan',
    method: 'post',
    data
  })
}

export function updatePlan(id, payload) {
  return request({
    url: `/api/v1/plan/${id}`,
    method: 'put',
    data: payload
  })
}
export function runPlan(id) {
  return request({
    url: `/api/v1/plan/${id}`,
    method: 'post'
  })
}

export function stopPlan(payload) {
  return request({
    url: '/api/v1/plan',
    method: 'put',
    data: payload
  })
}

export function deletePlan(id) {
  return request({
    url: `/api/v1/plan/${id}`,
    method: 'delete'
  })
}

export function getPlans(params) {
  return request({
    url: '/api/v1/plan',
    method: 'get',
    params
  })
}

export function getPlan(id) {
  return request({
    url: `/api/v1/plan/${id}`,
    method: 'get'
  })
}

export function getCrontab() {
  return request({
    url: '/api/v1/crontab',
    method: 'get'
  })
}

export function getHistory(params) {
  return request({
    url: '/api/v1/history',
    method: 'get',
    params
  })
}
