package iljafatkulin.advertisement.portal.repositories;

import iljafatkulin.advertisement.portal.model.ProductAttributeValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductAttributeValuesRepository extends JpaRepository<ProductAttributeValue, Integer> {
}
