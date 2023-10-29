package iljafatkulin.advertisement.portal.repositories;

import iljafatkulin.advertisement.portal.model.Attribute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AttributesRepository extends JpaRepository<Attribute, Integer> {
    Optional<Attribute> findFirstByName(String name);
}
