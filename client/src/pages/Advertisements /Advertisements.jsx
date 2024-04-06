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

const ViewType = {
    CARD: 'card',
    TABLE: 'table',
};

const Advertisements = () => {
    const [viewType, setViewType] = useState(ViewType.CARD);
    const [filters, setFilters] = useState([]);
    const [sort, setSort] = useState('');

    const {isAuth} = useAuth();

    const [error, setError] = useState();
    const {category} = useParams();
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
        CategoryService.getCategoryAttributes(category)
            .then(response => {
                const updatedAttributes = response.map(attribute => ({ ...attribute, value: '' }));

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
                    <div className={"header"}>
                        <Navbar/>
                        <h1>{category}</h1>
                        <div className={"return"}>
                            <Link to={'/categories'} id={"return"}><p className={"return-link"}>Categories</p></Link>
                            <p>{category}</p>
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

                        <button onClick={() => setIsFiltersVisible(!isFiltersVisible)} className={styles.filterButton}>Filters</button>
                        <AdvertisementFilters
                            setIsFiltersVisible={setIsFiltersVisible}
                            isFiltersVisible={isFiltersVisible}
                            filters={filters}
                            setFilters={setFilters}
                            onFiltersChange={handleFiltersChange}
                        />
                    </div>

                    {isAuth &&
                        <Link to={'/advertisements/' + category + '/create'} className={"create"}>
                            <button className={"button-create"}>Create</button>
                        </Link>
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
                            <p>Advertisements not found</p>
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