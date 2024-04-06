package iljafatkulin.advertisement.portal.repositories;

import iljafatkulin.advertisement.portal.model.Category;
import iljafatkulin.advertisement.portal.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductsRepository extends JpaRepository<Product, Integer> {
//    List<Product> findByCategoryIdOrderById(int categoryId, Sort sort);

    Page<Product> findByCategoryId(int categoryId, Pageable pageable);

    long countByCategoryName(String categoryName);

    List<Product> findBySellerEmail(String email);

//    List<Product> findByStartingNameAndPriceRangeIgnoreCase(String name, Double minPrice, Double maxPrice, Category category, Sort sort);
//    List<Product> findByCategoryAndNameStartingWithIgnoreCaseAndPriceBetween(Category category, String name, Double minPrice, Double maxPrice, Sort sort);



    @Query("SELECT p FROM Product p " +
            "WHERE LOWER(p.name) LIKE :productName% " +
            "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
            "AND (:maxPrice <= 0 OR p.price <= :maxPrice)" +
            "AND (:category = p.category)" +
            "ORDER BY CASE WHEN :direction = 'ASC' THEN p.name END ASC," +
            "CASE WHEN :direction = 'DESC' THEN p.name END DESC," +
            "CASE WHEN :sort = 'price' AND :direction = 'ASC' THEN p.price END ASC," +
            "CASE WHEN :sort = 'price' AND :direction = 'DESC' THEN p.price END DESC")
    List<Product> findByStartingNameAndPriceRangeIgnoreCase(
            @Param("productName") String productName,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("category") Category category,
            @Param("direction") String direction,
            @Param("sort") String sort);
}
