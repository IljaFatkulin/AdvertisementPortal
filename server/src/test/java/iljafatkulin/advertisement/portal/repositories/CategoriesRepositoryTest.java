package iljafatkulin.advertisement.portal.repositories;

import iljafatkulin.advertisement.portal.model.Category;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class CategoriesRepositoryTest {
    @Autowired
    private CategoriesRepository categoriesRepository;

    Category category;

    @BeforeEach
    void setUp() {
        category = categoriesRepository.save(new Category("category"));
    }

    @AfterEach
    void tearDown() {
        categoriesRepository.deleteAll();
    }

    @Test
    void testWithFullNameFindFirstByNameIgnoreCase() {
        Optional<Category> category = categoriesRepository.findFirstByNameIgnoreCase(this.category.getName());

        assertThat(category.isPresent()).isTrue();
        assertEquals("category", category.get().getName());
    }

    @Test
    void testWithFirstLettersFindFirstByNameIgnoreCase() {
        Optional<Category> category = categoriesRepository.findFirstByNameIgnoreCase("CatEgory");

        assertThat(category.isPresent()).isTrue();
        assertEquals("category", category.get().getName());
    }

    @Test
    void testNotFoundFindFirstByNameIgnoreCase() {
        Optional<Category> category = categoriesRepository.findFirstByNameIgnoreCase("cars");

        assertThat(category.isPresent()).isFalse();
    }
}