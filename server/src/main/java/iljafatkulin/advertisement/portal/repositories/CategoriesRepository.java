package iljafatkulin.advertisement.portal.repositories;

import iljafatkulin.advertisement.portal.model.Category;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriesRepository extends JpaRepository<Category, Integer> {
    Optional<Category> findFirstByNameIgnoreCase(String name);

    List<Category> findBySectionId(int sectionId);
}
