import axios from "axios";

export default class AdvertisementService {
    static url = 'http://localhost:8080';

    static async getAll(category) {
        return await axios.get(this.url + '/products?category=' + category)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                throw error;
            })
    }

    static async getPage(category, page) {
        return await axios.get(this.url + '/products?category=' + category + '&page=' + page + '&limit=12')
            .then(response => {
                return response.data;
            })
            .catch(error => {
                throw error;
            });
    }

    static async getCount(category) {
        return await axios.get(this.url + '/products/count?category=' + category)
            .then(response => {
                return response.data;
            });
    }

    static async getById(id) {
        return await axios.get(this.url + '/products/' + id)
            .then(response => {
                return response.data;
            }).catch(error => {
                throw error;
        })
    }

    static async deleteById(id) {
        return await axios.post(this.url + '/products/delete', {
            id: id
        }).then(response => {
            return response.data;
        });
    }

    static async create(product, attributes, category) {
        const formData = new FormData();
        formData.append('image', product.image);
        formData.append('product', JSON.stringify(product));
        formData.append('attributes', JSON.stringify(attributes));
        formData.append('categoryName', category);

        return await axios.post(this.url + '/products/create', formData, {
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

    static async edit(product, attributes, id) {
        const formData = new FormData();
        formData.append('image', product.image);
        formData.append('product', JSON.stringify(product));
        formData.append('attributes', JSON.stringify(attributes));
        formData.append('id', id);

        return await axios.post(this.url + '/products/edit', formData, {
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

    static async testPost(image) {
        const formData = new FormData();
        formData.append("file", image);

        return await axios.post(this.url + '/products/test', formData, {headers: { "Content-Type": "multipart/form-data",}})
            .then(response => {
                return response.data;
            })
    }
}