import React from 'react';
import { Form, Button } from 'react-bootstrap';
import styles from './AdvertisementFilters.module.css';
import { useTranslation } from 'react-i18next';

const AdvertisementFilters = ({ filters, setFilters, onFiltersChange, isFiltersVisible,setIsFiltersVisible }) => {
    const { t } = useTranslation();
    const handleFilterValueChange = (name, value) => {
        const updatedFilters = filters.map(attribute => {
            if (attribute.name === name) {
                return { ...attribute, value: value };
            } else {
                return attribute;
            }
        });

        setFilters(updatedFilters);
        onFiltersChange(updatedFilters);
    };

    const handleClose = () => {
        setIsFiltersVisible(false);
    }

    const handleClearFilters = () => {
        const updatedFilters = filters.map(attribute => {
            return {...attribute, value: ''};
        });
        setFilters(updatedFilters);
        onFiltersChange(updatedFilters);
    }

    return (
        isFiltersVisible &&
            <div className={styles.overlay} onClick={handleClose}>
                <div className={styles.filters} onClick={e => e.stopPropagation()}>
                    {filters.map(filter => (
                        <div key={filter.id}>
                            <p>{filter.label}</p>
                            <select
                                className={styles.FilterSelect}
                                value={filter.value}
                                onChange={e => handleFilterValueChange(filter.name, e.target.value)}
                            >
                                <option value="">{t('Select')}...</option>
                                {filter.options.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                    <button onClick={handleClose}>{t('Filter')}</button>
                    <button onClick={handleClearFilters}>{t('Clear')}</button>
                </div>
            </div>
    );
};

export default AdvertisementFilters;