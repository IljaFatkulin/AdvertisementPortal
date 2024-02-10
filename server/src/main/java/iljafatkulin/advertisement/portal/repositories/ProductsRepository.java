package iljafatkulin.advertisement.portal.repositories;

import iljafatkulin.advertisement.portal.model.Category;
import iljafatkulin.advertisement.portal.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductsRepository extends JpaRepository<Product, Integer> {
    List<Product> findByCategoryIdOrderById(int categoryId);

    Page<Product> findByCategoryIdOrderById(int categoryId, PageRequest pageRequest);

    long countByCategoryName(String categoryName);

    List<Product> findBySellerEmail(String email);

    @Query("SELECT p FROM Product p " +
            "WHERE LOWER(p.name) LIKE :productName% " +
            "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
            "AND (:maxPrice <= 0 OR p.price <= :maxPrice)" +
            "AND (:category = p.category)")
    List<Product> findByStartingNameAndPriceRangeIgnoreCase(
            @Param("productName") String productName,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("category") Category category);
}
