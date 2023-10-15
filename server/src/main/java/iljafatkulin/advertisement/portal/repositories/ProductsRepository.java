package iljafatkulin.advertisement.portal.repositories;

import iljafatkulin.advertisement.portal.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductsRepository extends JpaRepository<Product, Integer> {
    List<Product> findByCategoryIdOrderById(int categoryId);

    Page<Product> findByCategoryIdOrderById(int categoryId, PageRequest pageRequest);

    long countByCategoryName(String categoryName);
}
