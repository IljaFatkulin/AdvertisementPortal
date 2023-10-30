import axios from 'axios';

const myAxios = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
});

const addAuthHeader = (userDetails) => {
    // myAxios.defaults.headers.common['Authorization'] = 'Basic ' + btoa(userDetails.email + ':' + userDetails.password);
    myAxios.defaults.headers.common['Authorization'] = `Bearer ${userDetails.token}`;
};

export { myAxios, addAuthHeader };