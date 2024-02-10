package iljafatkulin.advertisement.portal.repositories;

import iljafatkulin.advertisement.portal.model.Category;
import iljafatkulin.advertisement.portal.model.Product;
import iljafatkulin.advertisement.portal.model.ProductAttributeValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductAttributeValuesRepository extends JpaRepository<ProductAttributeValue, Integer> {
    @Query("SELECT pav.product FROM ProductAttributeValue pav " +
            "WHERE LOWER(pav.attribute.name) IN :attributeNames " +
            "AND (pav.value IN :attributeValues) " +
            "AND (pav.product.category = :category) " +
            "GROUP BY pav.product " +
            "HAVING COUNT(DISTINCT LOWER(pav.attribute.name)) = :sizeOfAttributeNames")
    List<Product> findProductsByAttributesAndValues(@Param("attributeNames") List<String> attributeNames,
                                                    @Param("attributeValues") List<String> attributeValues,
                                                    @Param("sizeOfAttributeNames") long sizeOfAttributeNames,
                                                    @Param("category")Category category);

}
