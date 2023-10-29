import React, {useEffect, useState} from 'react';
import CategoryService from "../../api/CategoryService";
import Loader from "../../components/Loader/Loader";
import {Link, useNavigate} from "react-router-dom";
import './Categories.css';
import Navbar from "../../components/Navbar/Navbar";
import useAuth from "../../hooks/useAuth";

const Categories = () => {
    const { isAdmin } = useAuth();

    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        CategoryService.getAll()
            .then(response => {
                setCategories(response);

                setTimeout(() => {
                    setIsLoading(false);
                }, 500);
            });
    }, []);

    function view(id) {
        navigate('/categories/' + id);
    }

    return (
        isLoading
            ?
            <Loader/>
            :
            <div className={"container"}>
                <div className={"header"}>
                    <Navbar/>
                    <h1>Categories</h1>
                </div>
                {isAdmin() &&
                    <Link to={'/categories/create'} className={"create"}>
                        <button className={"button-create"}>Create</button>
                    </Link>
                }
                <div className={"content"}>
                    {categories.length
                        ?
                        categories.map(category =>
                            <div className={"category"} key={category.id}>
                                <Link className={"link"} to={'/advertisements/' + category.name}>{category.name}</Link>
                                {isAdmin() && <img src="img/settings.png" onClick={() => view(category.id)} alt={""}></img>}
                            </div>
                        )
                        :
                        <p>Categories not found</p>
                    }
                </div>
            </div>
    );
};

export default Categories;