import React, {useEffect, useState} from 'react';
import AdvertisementService from "../../api/AdvertisementService";
import styles from './AdvertisementSearch.module.css';

const AdvertisementSearch = ({setAdvertisements, category, setPages, onFilterClear, setViewType, setSort}) => {
    const [form, setForm] = useState({
        name: '',
        min: '',
        max: ''
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        if(form.name || form.min || form.max) {
            let min = form.min ? form.min : 0;
            let max = form.max ? form.max : 0;

            AdvertisementService.searchAdvertisements(form.name, min, max, category)
                .then(response => {
                    setPages(1);
                    setAdvertisements(response);
                })
        }
    }

    const filterClear = () => {
        setForm({
            name: '',
            min: '',
            max: ''
        });

        onFilterClear();
    }

    return (
        <div className={styles.search}>
            <div>
                <p>Name</p>
                <input
                    className={styles.searchName}
                    type="text"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                />
            </div>
            <div>
                <p>Price</p>
                <input
                    className={styles.searchPrice}
                    placeholder="Min"
                    type="number"
                    value={form.min}
                    onChange={e => setForm({...form, min: e.target.value})}
                />
                -
                <input
                    className={styles.searchPrice}
                    placeholder="Max"
                    type="number"
                    value={form.max}
                    onChange={e => setForm({...form, max: e.target.value})}
                />
            </div>

            <button onClick={handleSubmit}>Search</button>
            <button onClick={filterClear}>Clear</button>
            <select className={styles.selectView} onChange={(e) => setViewType(e.target.value)}>
                <option value="card" disabled selected>View Type</option>
                <option value="table">Table</option>
                <option value="card">Card</option>
            </select>

            <select className={styles.selectView} onChange={(e) => setSort(e.target.value)}>
                <option value="" disabled selected>Sort</option>
                <option value="createdAt_asc">Newest</option>
                <option value="createdAt_desc">Oldest</option>
                <option value="price_desc">Price high to low</option>
                <option value="price_asc">Price low to high</option>
                <option value="name_asc">Name ascending</option>
                <option value="name_desc">Name descending</option>
            </select>
        </div>
    );
};

export default AdvertisementSearch;