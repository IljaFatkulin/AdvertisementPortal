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
}