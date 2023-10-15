import React, {useState} from 'react';
import CategoryService from "../../../api/CategoryService";
import styles from '../../Advertisements /AdvertisementCreate/AdvertisementCreate.module.css';
import Navbar from "../../../components/Navbar/Navbar";
import {Link} from "react-router-dom";

const CategoryCreate = () => {
    const [name, setName] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        CategoryService.create(name)
            .then(response => {
                console.log(response);
            })
    }

    return (
        <div className={"container"}>
            <div className={"header"}>
                <Navbar/>
                <h1>Create</h1>
                <div className={"return"}>
                    <Link to={'/categories'} id={"return"}><p className={"return-link"}>Categories</p></Link>
                    <p>Create</p>
                </div>
            </div>
            <div className={styles.formCreate}>
            <form>
                <p>Name:</p>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <div className={styles.buttons}>
                    <button onClick={handleSubmit}>Create</button>
                </div>
            </form>
            </div>
        </div>
    );
};

export default CategoryCreate;