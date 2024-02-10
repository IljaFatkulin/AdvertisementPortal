package iljafatkulin.advertisement.portal.dao.impl;

import iljafatkulin.advertisement.portal.dao.SectionDAO;
import iljafatkulin.advertisement.portal.model.Section;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class SectionDAOImpl implements SectionDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<Section> getAllSectionsWithCategories() {
        String jpql = "SELECT DISTINCT s FROM Section s LEFT JOIN FETCH s.categories";
        TypedQuery<Section> query = entityManager.createQuery(jpql, Section.class);
        return query.getResultList();
    }
}
