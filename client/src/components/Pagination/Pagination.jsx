import React, {useEffect} from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ pagesCount, currentPage, onPageChange, pages, setPages }) => {
    useEffect(() => {
        let start = currentPage - 2 >= 0 ? currentPage - 2 : 0;
        let end = start + 5 < pagesCount ? start + 5 : pagesCount;

        setPages({start: start, end: end-1, current: currentPage});
    }, [currentPage, pagesCount, setPages]);

    const getButtons = () => {
        let buttons = [];
        for (let i = pages.start; i <= pages.end; i++) {
            buttons.push(
                <button
                    key={i}
                    className={i === currentPage ? styles.active : ''}
                    onClick={() => onPageChange(i)}
                >
                    {i + 1}
                </button>
            );
        }
        return buttons;
    };
    return (
        <div className={styles.pagination}>
            {getButtons()}
        </div>
    );
};

export default Pagination;