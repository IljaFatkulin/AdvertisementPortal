import React, {useContext, useEffect, useState} from 'react';
import styles from './CategoryView.module.css';
import Loader from "../../../components/Loader/Loader";
import NotFound from "../../NotFound/NotFound";
import Navbar from "../../../components/Navbar/Navbar";
import {Link, useNavigate, useParams} from "react-router-dom";
import {UserDetailsContext} from "../../../context/UserDetails";
import CategoryService from "../../../api/CategoryService";
import { useTranslation } from 'react-i18next';
import SectionStats from '../../../components/ProfileStats/SectionStats';
import translate from '../../../util/translate';

const SectionView = () => {
    const { t } = useTranslation();
    const {userDetails} = useContext(UserDetailsContext);
    const {id} = useParams();
    const [isStatsOpen, setIsStatsOpen] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [notFoundError, setNotFoundError] = useState();

    const [section, setSection] = useState({});

    const [error, setError] = useState('');

    const navigate = useNavigate();
    const lang = localStorage.getItem('language') || 'en';

    useEffect(() => {
        setNotFoundError(null);
        CategoryService.findSectionById(id, userDetails)
            .then(async response => {
                console.log(response)
                if (lang !== 'en') {
                    response.data.name = await translate(response.data.name, lang);
                }
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

    const handleRename = async () => {
        let name = section.name;
        if (lang !== 'en') {
            name = await translate(name, 'en');
        }

        CategoryService.renameSection(id, name, userDetails)
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

    const openStats = () => {
        setIsStatsOpen(true);
    }

    const closeStats = () => {
        setIsStatsOpen(false);
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
                    <SectionStats isOpen={isStatsOpen} closeModal={closeStats} section={section.name} />
                    <div className={"header"}>
                        <Navbar/>
                        <h1>{t('Create')}</h1>
                        <div className={"return"}>
                            <Link to={'/'} id={"return"}><p className={"return-link"}>{t('Categories')}</p></Link>
                            <p>{t('View')}</p>
                        </div>
                    </div>
                    <div className={styles.content}>
                        <button onClick={handleDeleteSection}>{t('Delete')}</button>
                        {error && <p style={{color: "red"}}>{error}</p>}
                        <p style={{marginBottom: "0", marginLeft: "-150px"}}>{t('Name')}</p>
                        <input
                            type="text"
                            value={section.name}
                            onChange={e => setSection({...section, name: e.target.value})}
                        />
                        <button onClick={handleRename}>{t('Rename')}</button>
                    </div>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <button onClick={openStats} style={{width: "150px"}}>{t('Stats')}</button>
                    </div>
                </div>
    );
};

export default SectionView;