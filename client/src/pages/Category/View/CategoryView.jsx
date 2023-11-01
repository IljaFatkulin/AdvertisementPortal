import React, {useContext, useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import CategoryService from "../../../api/CategoryService";
import NotFound from "../../NotFound/NotFound";
import {UserDetailsContext} from "../../../context/UserDetails";
import Navbar from "../../../components/Navbar/Navbar";
import styles from "./CategoryView.module.css";

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
            .then(() => {
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
                <div className={"container"}>
                    <div className={"header"}>
                        <Navbar/>
                        <h1>Create</h1>
                        <div className={"return"}>
                            <Link to={'/categories'} id={"return"}><p className={"return-link"}>Categories</p></Link>
                            <p>View</p>
                        </div>
                    </div>
                    <div className={styles.content}>
                        <p>Name: {category.name}</p>
                        <p>Attributes:</p>
                        {category.attributes.length
                        ?
                            category.attributes.map(attribute =>
                                <div key={attribute.id} className={styles.attribute}>
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
                </div>
    );
};

export default CategoryView;