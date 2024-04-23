import React, {useContext, useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import CategoryService from "../../../api/CategoryService";
import NotFound from "../../NotFound/NotFound";
import {UserDetailsContext} from "../../../context/UserDetails";
import Navbar from "../../../components/Navbar/Navbar";
import styles from "./CategoryView.module.css";

const CategoryView = () => {
    const {userDetails} = useContext(UserDetailsContext);

    const {id} = useParams();
    const [notFoundError, setNotFoundError] = useState();

    const [isLoading, setIsLoading] = useState(true);
    const [category, setCategory] = useState({});
    const [attributeName, setAttributeName] = useState("");

    function fetchCategoryInfo() {
        setIsLoading(true);

        CategoryService.getCategoryInfo(id)
            .then(response => {
                setCategory(response);
            })
            .catch(e => {
                setNotFoundError(e.response.data);
            }).finally(() => {
                setIsLoading(false);
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

    const navigate = useNavigate();

    const handleDeleteCategory = () => {
        CategoryService.deleteCategory(id, userDetails)
            .then(() => {
                navigate('/');
            })
    }

    const [error, setError] = useState('');

    const handleRename = () => {
        CategoryService.renameCategory(id, category.name, userDetails)
            .then(response => {
                console.log(response.data);
                if(response.status === 200) {
                    navigate('/');
                }
            }).catch(error => {
                if(error.response.status === 400) {
                    setError('This category name already exists');
                }
        })
    }

    return (
        isLoading
            ?
            <Loader/>
            :
            notFoundError
            ?
                <NotFound error={notFoundError}/>
            :
                <div className={"container"}>
                    <div className={"header"}>
                        <Navbar/>
                        <h1>Create</h1>
                        <div className={"return"}>
                            <Link to={'/'} id={"return"}><p className={"return-link"}>Categories</p></Link>
                            <p>View</p>
                        </div>
                    </div>
                    <div className={styles.content}>
                        {category.name !== 'Without category' && <button onClick={handleDeleteCategory}>Delete</button>}
                        {error && <p style={{color: "red"}}>{error}</p>}
                        <p>Name:
                            <input
                                type="text"
                                value={category.name}
                                onChange={e => setCategory({...category, name: e.target.value})}
                            />
                            {category.name !== 'Without category' && <button onClick={handleRename}>Rename</button>}
                        </p>
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