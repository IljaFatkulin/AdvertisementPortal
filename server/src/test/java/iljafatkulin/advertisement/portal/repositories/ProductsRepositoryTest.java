package iljafatkulin.advertisement.portal.repositories;

import iljafatkulin.advertisement.portal.models.Category;
import iljafatkulin.advertisement.portal.models.Product;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class ProductsRepositoryTest {
    @Autowired
    private ProductsRepository productsRepository;

    @Autowired
    private CategoriesRepository categoriesRepository;

    private Category category1;
    private Category category2;

    @BeforeEach
    void setUp() {
        category1 = new Category("Category1");
        category2 = new Category("Category2");

        category1 = categoriesRepository.save(category1);
        category2 = categoriesRepository.save(category2);
        System.out.println(category1.getId());

        Product product1 = new Product("Product1", 0, "d1");
        product1.setCategory(category1);

        Product product2 = new Product("Product2", 0, "d2");
        product2.setCategory(category1);

        Product product3 = new Product("Product3", 0, "d3");
        product3.setCategory(category2);

        productsRepository.saveAll(List.of(product1, product2, product3));
    }

    @AfterEach
    void tearDown() {
        categoriesRepository.deleteAll();
        productsRepository.deleteAll();
    }

    @Test
    void testFindByCategoryIdOrderById() {
        List<Product> products = productsRepository.findByCategoryIdOrderById(category1.getId());

        assertEquals(2, products.size());
        assertEquals("Product1", products.get(0).getName());
        assertEquals("Product2", products.get(1).getName());
    }

    @Test
    void testFindByCategoryIdOrderByIdReturnPages() {
        Page<Product> pages = productsRepository.findByCategoryIdOrderById(category1.getId(), PageRequest.of(1, 1));

        assertEquals(1, pages.getSize());
        assertEquals("Product2", pages.get().findFirst().get().getName());
    }

    @Test
    void testCountByCategoryName() {
        long count = productsRepository.countByCategoryName(category2.getName());

        assertEquals(1, count);
    }
}