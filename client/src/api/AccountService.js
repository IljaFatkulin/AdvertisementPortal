import {addAuthHeader, myAxios} from "../config/axiosConfig";

export default class AccountService {
    static register(user) {
        return myAxios.post('/accounts/create', {
            email: user.email,
            password: user.password
        }).then(response => {
            return response.data;
        });
    }

    static authenticate(user) {
        return myAxios.post('/accounts/authenticate', {
            email: user.email,
            password: user.password
        });
    }

    static verifyWithToken(token) {
        return myAxios.post('/accounts/verify', {
            token: token
        });
    }

    static changePassword(oldPassword, newPassword, userDetails) {
        const authAxios = addAuthHeader(userDetails);
        return authAxios.post('/accounts/change/password', {
            old_password: oldPassword,
            new_password: newPassword
        });
    }

    static changeEmail(password, email, userDetails) {
        const authAxios = addAuthHeader(userDetails);
        return authAxios.post('/accounts/change/email', {
            password: password,
            email: email
        });
    }
}