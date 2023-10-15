import axios from "axios";

export default class CategoryService {
    static url = 'http://localhost:8080';

    static async getAll() {
        return await axios.get( this.url +'/categories')
            .then(response => {
                return response.data;
            });
    }

    static async getCategoryInfo(id) {
        return await axios.get(this.url + '/categories/' + id)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                throw error;
            })
    }

    static async create(name) {
        return await axios.post(this.url + '/categories/create', {
            name: name
        })
            .then(response => {
                return response.data;
            })
    }

    static async removeAttribute(categoryId, attributeId) {
        return await axios.post(this.url + '/categories/attribute/remove', {
            categoryId: categoryId,
            attributeId: attributeId
        })
            .then(response => {
                return response.data;
            })
    }

    static async addAttribute(categoryId, attributeName) {
        return await axios.post(this.url + '/categories/attribute/add', {
            categoryId: categoryId,
            attributeName: attributeName
        })
            .then(response => {
                return response.data;
            });
    }
}