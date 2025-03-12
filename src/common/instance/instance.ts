import axios from "axios"

const token = '6ed2b37b-690c-457f-b05f-74f03150ae17'
const apiKey = '58ec0fca-2e30-428d-9938-2e3b48a0604c'

export const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1',
  headers: {
    Authorization: `Bearer ${token}`,
    'API-KEY': apiKey,
  }
})