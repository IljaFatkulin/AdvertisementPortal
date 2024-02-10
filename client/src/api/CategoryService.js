import { myAxios, addAuthHeader } from "../config/axiosConfig";
import {add} from "react-modal/lib/helpers/classList";

export default class CategoryService {
    static getAll() {
        return myAxios.get( '/categories')
            .then(response => {
                return response.data;
            });
    }

    static getSections() {
        return myAxios.get('/sections')
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

    static createCategory(sectionId, name, userDetails) {
        const authAxios = addAuthHeader(userDetails);
        return authAxios.post('/sections/add/category', {
            sectionId: sectionId,
            categoryName: name
        });
    }

    static createSection(name, userDetails) {
        const authAxios = addAuthHeader(userDetails);
        return authAxios.post('/sections', {
            name: name
        });
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

    static getCategoryAttributes(name) {
        return myAxios.get('/categories/' + name + '/attributes')
            .then(response => {
                return response.data;
            });
    }

    static deleteCategory(id, userDetails) {
        const authAxios = addAuthHeader(userDetails);
        return authAxios.post('/categories/delete', {
            id: id
        });
    }

    static renameCategory(id, name, userDetails) {
        const authAxios = addAuthHeader(userDetails);
        return authAxios.post('/categories/rename', {
            id: id,
            name: name
        });
    }

    static findSectionById(id, userDetails) {
        const authAxios = addAuthHeader(userDetails);
        return authAxios.get('/sections/' + id);
    }

    static deleteSection(id, userDetails) {
        const authAxios = addAuthHeader(userDetails);
        return authAxios.post('/sections/delete', {
            id: id
        });
    }

    static renameSection(id, name, userDetails) {
        const authAxios = addAuthHeader(userDetails);
        return authAxios.post('/sections/rename', {
            id: id,
            name: name
        });
    }
}