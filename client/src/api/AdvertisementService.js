import { myAxios, addAuthHeader } from "../config/axiosConfig";
import {remove} from "react-modal/lib/helpers/classList";

export default class AdvertisementService {
    static getPage(category, page, sortBy, order) {
        const sort = sortBy && order ? `&sortBy=${sortBy}&order=${order}` : '';
        return myAxios.get('/products?category=' + category + '&page=' + page + '&limit=12' + sort)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                throw error;
            });
    }

    static getPageWithFilter(category, page, filters) {
        const filteredAttributes = filters.filter(filter => filter.value);

        const queryParams = new URLSearchParams({
            category: category,
        });

        filteredAttributes.forEach(filter => {
            queryParams.append('attributes', filter.name);
            queryParams.append('values', filter.value);
        });


        return myAxios.get(`/products?${queryParams}`)
            .then(response => {
                return response.data;
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
        const authAxios = addAuthHeader(userDetails);
        return authAxios.post('/products/delete', {
            id: id
        }).then(response => {
            return response.data;
        });
    }

    static create(product, attributes, category, images, userDetails) {
        const formData = new FormData();
        formData.append('avatar', product.avatar);
        delete product.avatar;
        formData.append('product', JSON.stringify(product));
        formData.append('attributes', JSON.stringify(attributes));
        formData.append('categoryName', category);

        images.forEach(image => {
            formData.append('images', image.image); // 'images' - это имя поля для каждого файла
        });

        const authAxios = addAuthHeader(userDetails);
        return authAxios.post('/products/create', formData, {
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

    static edit(product, attributes, id, images, newImages, imagesToDelete, userDetails) {
        const formData = new FormData();
        if(product.avatar) {
            formData.append('avatar', product.avatar);
            delete product.avatar;
        }
        formData.append('product', JSON.stringify(product));
        formData.append('attributes', JSON.stringify(attributes));
        formData.append('id', id);

        images.forEach(image => {
            formData.append('images', image.image);
            formData.append('imagesIds', image.id);
        });

        newImages.forEach(image => {
            formData.append('newImages', image.image);
        });

        imagesToDelete.forEach(id => {
            formData.append('imagesToDelete', id);
        });

        // formData.append('images', images);
        // images.forEach((image, index) => {
        //     formData.append(`images[${index}].id`, image.id);
        //     formData.append(`images[${index}].image`, image.image);
        // });
        

        const authAxios = addAuthHeader(userDetails);
        return authAxios.post('/products/edit', formData, {
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

    static getUserAdvertisements(email) {
        return myAxios.get('/products/user/'+email)
            .then(response => {
                return response.data
            });
    }

    static searchAdvertisements(name, minPrice, maxPrice, category, sortBy, order) {
        name = name ? name : '';
        minPrice = minPrice ? minPrice : 0;
        maxPrice = maxPrice ? maxPrice : 0;
        return myAxios.get('/products?category=' + category + '&name=' + name + '&minPrice=' + minPrice + '&maxPrice=' + maxPrice + '&sortBy=' + sortBy + '&order=' + order)
            .then(response => {
                return response.data;
            })
    }
}