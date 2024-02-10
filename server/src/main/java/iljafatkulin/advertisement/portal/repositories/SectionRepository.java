package iljafatkulin.advertisement.portal.repositories;

import iljafatkulin.advertisement.portal.model.Section;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SectionRepository extends JpaRepository<Section, Integer> {
    Optional<Section> findByName(String name);

    Optional<Section> findByNameIgnoreCase(String name);
}
