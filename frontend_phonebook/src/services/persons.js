import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const del = id => {
    return axios.delete(`${baseUrl}/${id}`)
}

const replace = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject)
}

export default { 
    getAll,
    create,
    del,
    replace
}