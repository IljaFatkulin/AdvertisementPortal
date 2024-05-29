import {addAuthHeader, myAxios} from "../config/axiosConfig";

export default class ProductViewService {
    static register(userId, authorized, productId) {
        return myAxios.post('/product_view/create', {
            userId: userId,
            authorized: authorized,
            productId: productId,
        });
    }

    static getAllViews(productId) {
        return myAxios.get('/product_view/' + productId);
    }

    static getAuthorizedViews(productId) {
        return myAxios.get('/product_view/' + productId + '/true');
    }

    static getProfileStats(userId) {
        return myAxios.get('/product_view/user/' + userId);
    }

    static getFavoriteCount(productId) {
        return myAxios.get(`/product_view/${productId}/favorite`);
    }

    static getCategoryStats(category) {
        return myAxios.get(`/product_view/category/${category}`);
    }

    static getSectionStats(section) {
        return myAxios.get(`/product_view/section/${section}`);
    }
}