import React, {useContext, useEffect, useState} from 'react';
import CategoryService from "../../api/CategoryService";
import Loader from "../../components/Loader/Loader";
import {Link, useNavigate} from "react-router-dom";
import styles from "./Categories.module.css";
import Navbar from "../../components/Navbar/Navbar";
import useAuth from "../../hooks/useAuth";
import {UserDetailsContext} from "../../context/UserDetails";

const Categories = ({create}) => {
    const {userDetails} = useContext(UserDetailsContext);

    const { isAdmin } = useAuth();

    const [isLoading, setIsLoading] = useState(true);

    const [sections, setSections] = useState([]);

    const navigate = useNavigate();

    const fetchSections = () => {
        CategoryService.getSections()
            .then(response => {
                const updatedSections = response.map(section => ({
                    ...section,
                    addCategoryVisible: false,
                    newCategory: '',
                    newCategoryError: ''
                }));
                setSections(updatedSections);
                setIsLoading(false);
            })
    }

    useEffect(() => {
        fetchSections();
    }, []);

    function viewCategory(id) {
        navigate('/' + id);
    }

    const handleAddCategory = (sectionId) => {
        setSections(sections.map(section => {
            if(section.id === sectionId) {
                return {...section, addCategoryVisible: !section.addCategoryVisible};
            }
            return section;
        }))
    }

    const handleCreateCategory = (sectionId) => {
        let name = sections.find(section => section.id === sectionId).newCategory;
        CategoryService.createCategory(sectionId, name, userDetails)
            .then(response => {
                if(response.status === 200) {
                    fetchSections();
                }
            }).catch(error => {
                if(error.response.status === 400) {
                    setSections(sections.map(section => {
                        if(section.id === sectionId) {
                            return {...section, newCategoryError: error.response.data}
                        }
                        return section;
                    }))
                }
        })
    }

    const onCategoryChange = (e, sectionId) => {
        const updatedSections = sections.map(s => {
            if (s.id === sectionId) {
                return { ...s, newCategory: e.target.value };
            }
            return s;
        });
        setSections(updatedSections);
    }

    const viewSection = (id) => {
        navigate('/sections/' + id);
    }

    return (
        isLoading
            ?
            <Loader/>
            :
            <div className={"container"}>
                <div className={"header"}>
                    <Navbar/>
                    <h1>{create ? 'Choose category' : 'Categories'}</h1>
                </div>
                {isAdmin() && !create &&
                    <Link to={'/create'} className={"create"}>
                        <button className={"button-create"}>Create</button>
                    </Link>
                }
                <div className={styles.content}>
                    {sections.length > 0
                    ?
                        sections.map(section =>
                            <div className={styles.section} key={section.id}>
                                <h2>{section.name}{isAdmin() && !create && <img className={styles.settings} src="img/settings.png" onClick={() => viewSection(section.id)} alt={""}></img>}</h2>
                                <ul>
                                {section.categories.length > 0 && section.categories.map(category =>
                                    <div className={styles.category} key={category.id}>
                                        <li key={category.id}>
                                            <Link className={styles.link} to={`/advertisements/${category.name}${create ? '/create' : ''}`}>{category.name}</Link>
                                            {isAdmin() && !create && <img className={styles.settings} src="img/settings.png" onClick={() => viewCategory(category.id)} alt={""}></img>}
                                        </li>
                                    </div>
                                )
                                }
                                {isAdmin() &&
                                    <div>
                                    {section.newCategoryError &&
                                        <li style={{color: "red"}}>{section.newCategoryError}</li>
                                    }
                                    <li style={{display: section.addCategoryVisible ? "block" : "none"}}>
                                        <input
                                            style={{padding: "0", height: "20px"}}
                                            type="text"
                                            value={section.newCategory}
                                            onChange={e => onCategoryChange(e, section.id)}
                                        />
                                        <button onClick={() => handleCreateCategory(section.id)} style={{height:"20px", fontSize: "14px"}}>create</button>
                                    </li>
                                    <li><button onClick={() => handleAddCategory(section.id)} style={{height:"20px", fontSize: "14px"}}>add</button></li>
                                    </div>
                                }
                                </ul>
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