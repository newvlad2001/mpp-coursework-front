import axios from "axios";

const API =  axios.create({
    //baseURL: "/api/",
    baseURL: "http://localhost:3000/api/",
    responseType: "json"
});

API.interceptors.request.use(function (config) {
    const token = localStorage.getItem('currentUser')
        ? JSON.parse(localStorage.getItem('currentUser')).token
        : '';
    config.headers.Authorization =  token !== '' ? `Bearer_${token}` : '';
    return config;
});

export default API;