import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import AdvertisementService from "../../api/AdvertisementService";
import NotFound from "../NotFound/NotFound";
import Navbar from "../../components/Navbar/Navbar";
import styles from './Advertisements.module.css';
import useAuth from "../../hooks/useAuth";
import AdvertisementCard from "../../components/AdvertisementCard/AdvertisementCard";
import CategoryService from "../../api/CategoryService";
import Pagination from "../../components/Pagination/Pagination";
import AdvertisementFilters from "../../components/AdvertisementFilters/AdvertisementFilters";
import AdvertisementSearch from "../../components/AdvertisementSearch/AdvertisementSearch";
import { useTranslation } from 'react-i18next';
import translate from '../../util/translate';
import CategoryStats from '../../components/ProfileStats/CategoryStats';

const ViewType = {
    CARD: 'card',
    TABLE: 'table',
};

const Advertisements = () => {
    const [viewType, setViewType] = useState(ViewType.CARD);
    const [filters, setFilters] = useState([]);
    const [sort, setSort] = useState('');
    const { t } = useTranslation();
    const [isStatsOpen, setIsStatsOpen] = useState(false);

    const {isAuth, isAdmin} = useAuth();

    const [error, setError] = useState();
    const {category} = useParams();
    const [categoryName, setCategoryName] = useState('');
    const lang = localStorage.getItem('language') || 'en';
    const [isLoading, setIsLoading] = useState(true);
    const [advertisements, setAdvertisements] = useState([]);

    const [pagesCount, setPagesCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pages, setPages] = useState({start: 0, end: 0});
    const fetchPagesCount = () => {
        AdvertisementService.getCount(category)
            .then(response => {
                let p = Math.ceil(response/12);
                setPagesCount(p);
                setCurrentPage(0);
            })
    }

    useEffect(() => {
        translate(category, lang).then(res => setCategoryName(res));

        CategoryService.getCategoryAttributes(category)
            .then(async response => {
                const updatedAttributes = await Promise.all(response.map(async attribute => ({
                    ...attribute,
                    label: await translate(attribute.name, lang),
                    value: '',
                    options: await Promise.all(attribute.options.map(async option => ({
                        value: option,
                        label: await translate(option, lang)
                    })))
                })));
                console.log(updatedAttributes)

                setFilters(updatedAttributes);
            });

        fetchPagesCount();
    }, []);

    useEffect(() => {
        fetchAdvertisements();
    }, [currentPage, sort]);

    function fetchAdvertisements() {
        // setIsLoading(true);
        let sortBy, oder;
        if (sort) {
            [sortBy, oder] = sort.split('_');
        }
        AdvertisementService.getPage(category, currentPage, sortBy, oder)
            .then(response => {
                setAdvertisements(response);

                console.log(response)
                setIsLoading(false);
            })
            .catch(e => {
                setIsLoading(false);
                console.log(e)
                setError(e.response.data);
            })
    }

    function handleFiltersChange(updatedFilters) {
        const nonEmptyFilters = updatedFilters.filter(attribute => attribute.value);
        if (nonEmptyFilters.length < 1) {
            fetchPagesCount();
            fetchAdvertisements();
        } else {
            setPages(1);
            AdvertisementService.getPageWithFilter(category, currentPage, nonEmptyFilters)
                .then(response => {
                    setAdvertisements(response);
                })
                .catch(e => {
                    setError(e.response.data);
                });
        }
    }

    const handleFilterClear = () => {
        fetchPagesCount();
        fetchAdvertisements();
    }

    const openStats = () => {
        setIsStatsOpen(true);
    }

    const closeStats = () => {
        setIsStatsOpen(false);
    }

    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

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
                    <CategoryStats isOpen={isStatsOpen} closeModal={closeStats} category={category} />
                    <div className={"header"}>
                        <Navbar/>
                        <h1>{categoryName}</h1>
                        <div className={"return"}>
                            <Link to={'/'} id={"return"}><p className={"return-link"}>{t('Categories')}</p></Link>
                            <p>{categoryName}</p>
                        </div>
                    </div>

                    <div className={styles.menu}>
                        <AdvertisementSearch
                            setAdvertisements={setAdvertisements}
                            category={category}
                            setPages={setPages}
                            onFilterClear={handleFilterClear}
                            setViewType={setViewType}
                            setSort={setSort}
                        />

                        <button onClick={() => setIsFiltersVisible(!isFiltersVisible)} className={styles.filterButton}>{t('Filters')}</button>
                        <AdvertisementFilters
                            setIsFiltersVisible={setIsFiltersVisible}
                            isFiltersVisible={isFiltersVisible}
                            filters={filters}
                            setFilters={setFilters}
                            onFiltersChange={handleFiltersChange}
                        />
                    </div>

                    {isAuth &&
                    <div style={{display: "flex", alignItems: "center", position: "relative"}}>
                        <Link to={'/advertisements/' + category + '/create'} className={"create"}>
                            <button className={"button-create"}>{t('Create')}</button>
                        </Link>

                        {isAdmin && <button onClick={openStats} style={{paddingInline: "20px", position: "absolute", right: "130px", top: "25px"}}>{t('Stats')}</button>}
                    </div>
                    }

                    <div className={viewType === ViewType.CARD ? styles.products : styles.productsTable}>
                        {advertisements.length
                        ?
                            advertisements.map(advertisement =>
                                <AdvertisementCard
                                    key={advertisement.id}
                                    advertisement={advertisement}
                                    category={category}
                                    viewType={viewType}
                                />
                            )
                        :
                            <p>{t('Advertisements not found')}</p>
                        }
                    </div>
                    <Pagination
                        pagesCount={pagesCount}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        pages={pages}
                        setPages={setPages}
                    />
                </div>
    );
};

export default Advertisements;