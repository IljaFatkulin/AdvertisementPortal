import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import AdvertisementService from "../../api/AdvertisementService";
import NotFound from "../NotFound/NotFound";
import Navbar from "../../components/Navbar/Navbar";
import styles from './Advertisements.module.css';
import ImageConverter from "../../components/ImageConverter/ImageConverter";
import useAuth from "../../hooks/useAuth";

const Advertisements = () => {
    const {isAuth} = useAuth();

    const [error, setError] = useState();
    const {category} = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [advertisements, setAdvertisements] = useState([]);

    const [pagesCount, setPagesCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pages, setPages] = useState({start: 0, end: 0});

    const [buttons, setButtons] = useState([]);

    const navigate = useNavigate();

    function changePage(page, count) {
        setCurrentPage(page);
        let start;
        let end;
        if(page-2 >= 0) {
            start = page-2;
        } else {
            start = 0;
        }

        if(start + 5 < count) {
            end = start + 5;
        } else {
            end = count-1;
        }
        setPages({start: start, end: end, current: page});
    }

    useEffect(() => {
        let b = [];
        for(let i = pages.start; i <= pages.end; i++) {
            if(i === pages.current) {
                b = ([...b, <button style={{backgroundColor: "#371E7B"}} key={i} onClick={() => changePage(i, pagesCount)}>{i+1}</button>])
            } else {
                b = ([...b, <button key={i} onClick={() => changePage(i, pagesCount)}>{i+1}</button>])

            }
        }
        setButtons(b);
    }, [pages])

    useEffect(() => {
        AdvertisementService.getCount(category)
            .then(response => {
                let p = Math.ceil(response/12);
                setPagesCount(p);
                changePage(0, p);
            })
    }, []);

    useEffect(() => {
        fetchAdvertisements();
    }, [currentPage]);

    function fetchAdvertisements() {
        setIsLoading(true);
        AdvertisementService.getPage(category, currentPage)
            .then(response => {
                setAdvertisements(response);

                setIsLoading(false);
            })
            .catch(e => {
                setIsLoading(false);
                setError(e.response.data);
            })
    }

    function view(id) {
        navigate('/advertisements/' + category + '/' + id);
    }

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
                    {isAuth &&
                        <Link to={'/advertisements/' + category + '/create'} className={"create"}>
                            <button className={"button-create"}>Create</button>
                        </Link>
                    }

                    <div className={styles.products}>
                        {advertisements.length
                        ?
                            advertisements.map(advertisement =>
                                <div className={styles.item} onClick={() => view(advertisement.id)} key={advertisement.id}>
                                    <div className={styles.itemImageContainer}>
                                        {advertisement.avatar
                                        ?
                                            <ImageConverter className={styles.itemImage} data={advertisement.avatar} />
                                        :
                                            <p>No image</p>
                                        }
                                        {/*<img style={{maxWidth: '100%', maxHeight: '300px', objectFit: "contain"}} src={img} alt="1"/>*/}
                                    </div>
                                    <div className={styles.itemInfo}>
                                        <p className={styles.name}>{advertisement.name}</p>
                                        <p className={styles.price}>€{advertisement.price}</p>
                                    </div>
                                </div>
                            )
                        :
                            <p>Advertisements not found</p>
                        }
                    </div>
                    <div className={styles.pagination}>
                        {buttons}
                    </div>
                </div>
    );
};

export default Advertisements;