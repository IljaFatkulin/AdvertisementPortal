import { myAxios, addAuthHeader } from "../config/axiosConfig";

export default class CategoryService {
    static getAll() {
        return myAxios.get( '/categories')
            .then(response => {
                return response.data;
            });
    }

    static getCategoryInfo(id) {
        return myAxios.get('/categories/' + id)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                throw error;
            })
    }

    static create(name, userDetails) {
        const authAxios = addAuthHeader(userDetails);
        return authAxios.post('/categories/create', {
            name: name
        })
            .then(response => {
                return response.data;
            })
    }

    static removeAttribute(categoryId, attributeId, userDetails) {
        const authAxios = addAuthHeader(userDetails);
        return authAxios.post('/categories/attribute/remove', {
            categoryId: categoryId,
            attributeId: attributeId
        })
            .then(response => {
                return response.data;
            })
    }

    static addAttribute(categoryId, attributeName, userDetails) {
        const authAxios = addAuthHeader(userDetails);
        return authAxios.post('/categories/attribute/add', {
            categoryId: categoryId,
            attributeName: attributeName
        })
            .then(response => {
                return response.data;
            });
    }
}