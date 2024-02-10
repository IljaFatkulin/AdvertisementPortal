import React, {useContext, useState} from 'react';
import CategoryService from "../../../api/CategoryService";
import styles from '../../Advertisements /AdvertisementCreate/AdvertisementCreate.module.css';
import Navbar from "../../../components/Navbar/Navbar";
import {Link, useNavigate} from "react-router-dom";
import {UserDetailsContext} from "../../../context/UserDetails";

const SectionCreate = () => {
    const {userDetails} = useContext(UserDetailsContext);

    const [name, setName] = useState("");

    const [error, setError] = useState('');

    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();

        CategoryService.createSection(name, userDetails)
            .then(response => {
                if(response.status === 201) {
                    navigate('/categories');
                }
            }).catch(error => {
                if(error.response.status === 400) {
                    setError(error.response.data);
                }
        })
    }

    return (
        <div className={"container"}>
            <div className={"header"}>
                <Navbar/>
                <h1>Create section</h1>
                <div className={"return"}>
                    <Link to={'/categories'} id={"return"}><p className={"return-link"}>Categories</p></Link>
                    <p>Create section</p>
                </div>
            </div>
            <div className={styles.formCreate}>
            <form>
                <div style={{color: "red"}}>
                    {error}
                </div>
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

export default SectionCreate;