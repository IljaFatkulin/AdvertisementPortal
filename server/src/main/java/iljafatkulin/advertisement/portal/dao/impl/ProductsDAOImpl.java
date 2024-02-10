package iljafatkulin.advertisement.portal.dao.impl;

import iljafatkulin.advertisement.portal.dao.ProductsDAO;
import iljafatkulin.advertisement.portal.model.Category;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class ProductsDAOImpl implements ProductsDAO {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void changeCategoryWhereCategoryIs(Category oldCategory, Category newCategory) {
        String jpql = "UPDATE Product p SET p.category = :newCategory WHERE p.category = :oldCategory";
        entityManager.createQuery(jpql)
                .setParameter("oldCategory", oldCategory)
                .setParameter("newCategory", newCategory)
                .executeUpdate();
    }
}
