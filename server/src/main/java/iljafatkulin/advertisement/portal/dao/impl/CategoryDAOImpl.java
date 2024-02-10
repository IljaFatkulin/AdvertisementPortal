package iljafatkulin.advertisement.portal.dao.impl;

import iljafatkulin.advertisement.portal.dao.CategoryDAO;
import iljafatkulin.advertisement.portal.model.Section;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

@Repository
public class CategoryDAOImpl implements CategoryDAO {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public void changeSectionWhereSectionIs(Section oldSection, Section newSection) {
        String jpql = "UPDATE Category c SET c.section = :newSection WHERE c.section = :oldSection";
        entityManager.createQuery(jpql)
                .setParameter("newSection", newSection)
                .setParameter("oldSection", oldSection)
                .executeUpdate();
    }
}
