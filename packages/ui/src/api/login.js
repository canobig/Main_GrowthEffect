import client from './client'

const login = (body) => client.post('/login', body)

export default {
    login
}
