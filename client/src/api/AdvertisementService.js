import { myAxios, addAuthHeader } from "../config/axiosConfig";

export default class AdvertisementService {
    static getPage(category, page) {
        return myAxios.get('/products?category=' + category + '&page=' + page + '&limit=12')
            .then(response => {
                return response.data;
            })
            .catch(error => {
                throw error;
            });
    }

    static getCount(category) {
        return myAxios.get('/products/count?category=' + category)
            .then(response => {
                return response.data;
            });
    }

    static getById(id) {
        return myAxios.get('/products/' + id)
            .then(response => {
                return response.data;
            }).catch(error => {
                throw error;
        })
    }

    static deleteById(id, userDetails) {
        addAuthHeader(userDetails);
        return myAxios.post('/products/delete', {
            id: id
        }).then(response => {
            return response.data;
        });
    }

    static create(product, attributes, category, userDetails) {
        const formData = new FormData();
        formData.append('image', product.image);
        formData.append('product', JSON.stringify(product));
        formData.append('attributes', JSON.stringify(attributes));
        formData.append('categoryName', category);

        addAuthHeader(userDetails);
        return myAxios.post('/products/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                return response
            })
            .catch(error => {
                if(error.response) {
                    return error.response;
                } else {
                    return error.message;
                }
            });
    }

    static edit(product, attributes, id, userDetails) {
        const formData = new FormData();
        formData.append('image', product.image);
        formData.append('product', JSON.stringify(product));
        formData.append('attributes', JSON.stringify(attributes));
        formData.append('id', id);

        addAuthHeader(userDetails);
        return myAxios.post('/products/edit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            })
            .then(response => {
                return response
            })
            .catch(error => {
                if(error.response) {
                    return error.response;
                } else {
                    return error.message;
                }
            });
    }
}