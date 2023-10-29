import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import CategoryService from "../../../api/CategoryService";
import NotFound from "../../NotFound/NotFound";
import {UserDetailsContext} from "../../../context/UserDetails";

const CategoryView = () => {
    const {userDetails} = useContext(UserDetailsContext);

    const {id} = useParams();
    const [error, setError] = useState();

    const [isLoading, setIsLoading] = useState(true);
    const [category, setCategory] = useState();
    const [attributeName, setAttributeName] = useState("");

    function fetchCategoryInfo() {
        setIsLoading(true);

        CategoryService.getCategoryInfo(id)
            .then(response => {
                setCategory(response);

                setIsLoading(false);
            })
            .catch(e => {
                setIsLoading(false);
                setError(e.response.data);
            })
    }

    useEffect(() => {
        fetchCategoryInfo();
    }, []);

    const removeAttribute = (attributeId) => {
        CategoryService.removeAttribute(id, attributeId, userDetails)
            .then(response => {
                fetchCategoryInfo();
            });
    }

    const addAttribute = (e) => {
        e.preventDefault();

        CategoryService.addAttribute(id, attributeName, userDetails)
            .then(response => {
                fetchCategoryInfo();
            });
    }

    return (
        isLoading
            ?
            <Loader/>
            :
            error
            ?
                <NotFound error={error}/>
            :
                <div>
                    <p>ID: {category.id}</p>
                    <p>Name: {category.name}</p>
                    <p>Attributes:</p>
                    {category.attributes.length
                    ?
                        category.attributes.map(attribute =>
                            <div key={attribute.id}>
                                <p>{attribute.name}</p>
                                <button onClick={() => removeAttribute(attribute.id)}>Remove</button>
                            </div>
                        )
                    :
                        <p>No attributes</p>
                    }
                    <form>
                        <input
                            placeholder="Attribute name"
                            type="text"
                            value={attributeName}
                            onChange={e => setAttributeName(e.target.value)}
                        />

                        <button onClick={addAttribute}>Add</button>
                    </form>
                </div>
    );
};

export default CategoryView;