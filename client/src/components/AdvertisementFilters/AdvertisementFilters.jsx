import React, {useState} from 'react';
import styles from './AdvertisementFilters.module.css';

const AdvertisementFilters = ({ filters, setFilters, onFiltersChange, isFiltersVisible,setIsFiltersVisible }) => {
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
                            <p>{filter.name}</p>
                            <input
                                type="text"
                                value={filter.value}
                                onChange={e => handleFilterValueChange(filter.name, e.target.value)}
                            />
                        </div>
                    ))}
                    <button onClick={handleClose}>Filter</button>
                    <button onClick={handleClearFilters}>Clear</button>
                </div>
            </div>
    );
};

export default AdvertisementFilters;