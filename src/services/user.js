import $http from '@/utils/http'

export function login (data) {
  return $http.post('/vue-admin-template/user/login', data)
}

export function getInfo (token) {
  return $http.get('/vue-admin-template/user/info', { token })
}

export function logout () {
  return $http.post('/vue-admin-template/user/logout')
}
