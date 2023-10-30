import { myAxios } from "../config/axiosConfig";

export default class AccountService {
    static register(user) {
        return myAxios.post('/accounts/create', {
            email: user.email,
            password: user.password
        }).then(response => {
            return response.data;
        }).catch(error => {
            throw error;
        })
    }

    static authenticate(user) {
        return myAxios.post('/accounts/authenticate', {
            email: user.email,
            password: user.password
        }).then(response => {
            return response
        })
    }
}