import React, {useContext, useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import Loader from "../../../components/Loader/Loader";
import CategoryService from "../../../api/CategoryService";
import NotFound from "../../NotFound/NotFound";
import {UserDetailsContext} from "../../../context/UserDetails";
import Navbar from "../../../components/Navbar/Navbar";
import styles from "./CategoryView.module.css";
import { useTranslation } from 'react-i18next';
import translate from '../../../util/translate';

const CategoryView = () => {
    const { t } = useTranslation();
    const {userDetails} = useContext(UserDetailsContext);

    const {id} = useParams();
    const [notFoundError, setNotFoundError] = useState();

    const [isLoading, setIsLoading] = useState(true);
    const [category, setCategory] = useState({});
    const [attributeName, setAttributeName] = useState("");
    const lang = localStorage.getItem('language') || 'en';

    function fetchCategoryInfo() {
        setIsLoading(true);

        CategoryService.getCategoryInfo(id)
            .then(async response => {
                console.log(response);
                if (lang !== 'en') {
                    response.name = await translate(response.name, lang)
                }
                const promises = response.attributes.map(async attribute => {
                    if (lang !== 'en') {
                        attribute.name = await translate(attribute.name, lang)
                    }
                    return attribute;
                })

                response.attributes = await Promise.all(promises);
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

    const addAttribute = async (e) => {
        e.preventDefault();

        let name = attributeName;
        if (lang !== 'en') {
            name = await translate(name, 'en')
        }

        CategoryService.addAttribute(id, name, userDetails)
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

    const handleRename = async () => {
        let name = category.name;
        if (lang !== 'en') {
            name = await translate(name, 'en');
        }

        CategoryService.renameCategory(id, name, userDetails)
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
                        <h1>{t('Create')}</h1>
                        <div className={"return"}>
                            <Link to={'/'} id={"return"}><p className={"return-link"}>{t('Categories')}</p></Link>
                            <p>{t('View')}</p>
                        </div>
                    </div>
                    <div className={styles.content}>
                        {category.name !== 'Without category' && <button onClick={handleDeleteCategory}>{t('Delete')}</button>}
                        {error && <p style={{color: "red"}}>{error}</p>}
                        <p style={{marginBottom: "0", marginLeft: "-150px"}}>{t('Name')}</p>
                        <input
                            type="text"
                            value={category.name}
                            onChange={e => setCategory({...category, name: e.target.value})}
                        />
                        {category.name !== 'Without category' && <button onClick={handleRename}>{t('Rename')}</button>}
                        <p style={{fontSize: 24, marginTop: "50px"}}>{t('Attributes')}:</p>
                        {category.attributes.length
                        ?
                            category.attributes.map(attribute =>
                                <div key={attribute.id} className={styles.attribute}>
                                    <p>{attribute.name}</p>
                                    <button onClick={() => removeAttribute(attribute.id)}>{t('Remove')}</button>
                                </div>
                            )
                        :
                            <p>{t('No attributes')}</p>
                        }
                        <form>
                            <input
                                placeholder={t("Attribute name")}
                                type="text"
                                value={attributeName}
                                onChange={e => setAttributeName(e.target.value)}
                            />

                            <button onClick={addAttribute}>{t('Add')}</button>
                        </form>
                    </div>
                </div>
    );
};

export default CategoryView;