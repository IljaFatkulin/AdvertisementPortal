package iljafatkulin.advertisement.portal.repositories;

import iljafatkulin.advertisement.portal.model.Attribute;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class AttributesRepositoryTest {

    @Autowired
    private AttributesRepository attributesRepository;

    Attribute attribute;

    @BeforeEach
    void setUp() {
        attribute = attributesRepository.save(new Attribute("motor"));
    }

    @AfterEach
    void tearDown() {
        attributesRepository.deleteAll();
    }

    @Test
    void testFindFirstByName() {
        Optional<Attribute> attribute = attributesRepository.findFirstByName(this.attribute.getName());

        assertThat(attribute.isPresent()).isTrue();
        assertEquals("motor", attribute.get().getName());
    }

    @Test
    void testNotFoundFindFirstByName() {
        Optional<Attribute> attribute = attributesRepository.findFirstByName("doors");

        assertThat(attribute.isPresent()).isFalse();
    }
}