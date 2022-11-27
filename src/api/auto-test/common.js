import request from '@/utils/request'

export function uploadFunc(payload) {
  return request({
    url: '/api/v1/upload',
    method: 'post',
    data: payload
  })
}

export function downloadFunc(file_name) {
  return request({
    url: '/api/v1/download',
    method: 'get',
    params: { filename: file_name }
  })
}

export function listFileFunc(dir_name) {
  return request({
    url: '/api/v1/files',
    method: 'get',
    params: { path: dir_name }
  })
}
