import React, {useContext, useEffect, useState} from 'react';
import styles from './CategoryView.module.css';
import Loader from "../../../components/Loader/Loader";
import NotFound from "../../NotFound/NotFound";
import Navbar from "../../../components/Navbar/Navbar";
import {Link, useNavigate, useParams} from "react-router-dom";
import {UserDetailsContext} from "../../../context/UserDetails";
import CategoryService from "../../../api/CategoryService";

const SectionView = () => {
    const {userDetails} = useContext(UserDetailsContext);
    const {id} = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [notFoundError, setNotFoundError] = useState();

    const [section, setSection] = useState({});

    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        setNotFoundError(null);
        CategoryService.findSectionById(id, userDetails)
            .then(response => {
                setSection(response.data);
            }).catch(error => {
                if(error.response.status === 404) {
                    setNotFoundError(error.response.data);
                }
            }).finally(() => {
                setIsLoading(false);
        });
    }, []);

    const handleDeleteSection = () => {
        setIsLoading(true);
        CategoryService.deleteSection(id, userDetails)
            .then(response => {
                if (response.status === 200) {
                    navigate('/');
                }
            }).finally(() => {
                setIsLoading(false);
            }
        )
    }

    const handleRename = () => {
        CategoryService.renameSection(id, section.name, userDetails)
            .then(response => {
                if(response.status === 200) {
                    navigate('/');
                }
            }).catch(error => {
                if(error.response.status === 400) {
                    setError(error.response.data);
                }
        }).finally(() => {
            setIsLoading(false);
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
                        {section.name !== 'Other' && <button onClick={handleDeleteSection}>Delete</button>}
                        {error && <p style={{color: "red"}}>{error}</p>}
                        <p>Name:
                            <input
                                type="text"
                                value={section.name}
                                onChange={e => setSection({...section, name: e.target.value})}
                            />
                            {section.name !== 'Other' && <button onClick={handleRename}>Rename</button>}
                        </p>
                    </div>
                </div>
    );
};

export default SectionView;