import axios from "axios";


const myAxios = axios.create({
    baseURL: 'http://localhost:8081/arknights',
    timeout: 10000,
    headers: { 
        'X-Custom-Header': 'foobar' ,
        'Content-Type': 'application/json;charset=UTF-8'
    },
    transformRequest: [function (data) {
        return JSON.stringify(data)
      }],
});

export default myAxios;
