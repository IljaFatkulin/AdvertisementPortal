import React, {useEffect, useState} from 'react';
import AdvertisementService from "../../api/AdvertisementService";
import styles from './AdvertisementSearch.module.css';
import { useTranslation } from 'react-i18next';

const AdvertisementSearch = ({setAdvertisements, category, setPages, onFilterClear, setViewType, setSort}) => {
    const { t } = useTranslation();
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
                <p>{t('Name')}</p>
                <input
                    className={styles.searchName}
                    type="text"
                    value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})}
                />
            </div>
            <div>
                <p>{t('Price')}</p>
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

            <button onClick={handleSubmit}>{t('Search')}</button>
            <button onClick={filterClear}>{t('Clear')}</button>
            <select className={styles.selectView} onChange={(e) => setViewType(e.target.value)}>
                <option value="card" disabled selected>{t('View Type')}</option>
                <option value="table">{t('Table')}</option>
                <option value="card">{t('Card')}</option>
            </select>

            <select className={styles.selectView} onChange={(e) => setSort(e.target.value)}>
                <option value="" disabled selected>{t('Sort')}</option>
                <option value="createdAt_asc">{t('Newest')}</option>
                <option value="createdAt_desc">{t('Oldest')}</option>
                <option value="price_desc">{t('Price high to low')}</option>
                <option value="price_asc">{t('Price low to high')}</option>
                <option value="name_asc">{t('Name ascending')}</option>
                <option value="name_desc">{t('Name descending')}</option>
            </select>
        </div>
    );
};

export default AdvertisementSearch;