import $http from '@/utils/http'

export function getList (params) {
  return $http.get('/vue-admin-template/table/list', params)
}
