package iljafatkulin.advertisement.portal.services;

import iljafatkulin.advertisement.portal.exceptions.CategoryNotFoundException;
import iljafatkulin.advertisement.portal.models.Attribute;
import iljafatkulin.advertisement.portal.models.Category;
import iljafatkulin.advertisement.portal.repositories.AttributesRepository;
import iljafatkulin.advertisement.portal.repositories.CategoriesRepository;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class CategoriesService {
    private final CategoriesRepository categoriesRepository;
    private final AttributesRepository attributesRepository;

    @Autowired
    public CategoriesService(CategoriesRepository categoriesRepository, AttributesRepository attributesRepository) {
        this.categoriesRepository = categoriesRepository;
        this.attributesRepository = attributesRepository;
    }

    public List<Category> findAll() {
        return categoriesRepository.findAll();
    }

    public Category findById(int id) {
        Category category = categoriesRepository.findById(id).orElseThrow(CategoryNotFoundException::new);

        Hibernate.initialize(category.getAttributes());

        return category;
    }

    public Category findByName(String name) {
        Category category = categoriesRepository.findFirstByNameIgnoreCase(name).orElseThrow(CategoryNotFoundException::new);

        Hibernate.initialize(category.getAttributes());

        return category;
    }

    @Transactional
    public void save(Category category)  {
        categoriesRepository.save(category);
    }

    @Transactional
    public void addAttribute(int categoryId, String attributeName) {
        Category category = categoriesRepository.findById(categoryId).orElseThrow(CategoryNotFoundException::new);
        Attribute attribute = attributesRepository.findFirstByName(attributeName).orElse(null);

        if(attribute == null) {
            attribute = new Attribute(attributeName);
            attributesRepository.save(attribute);
        }

        category.addAttribute(attribute);
        categoriesRepository.save(category);
    }

    @Transactional
    public void removeAttribute(int categoryId, int attributeId) {
        Category category = categoriesRepository.findById(categoryId).orElseThrow(CategoryNotFoundException::new);
        Attribute attribute = attributesRepository.findById(attributeId).orElse(null);

        if(attribute != null) {
            category.removeAttribute(attribute);
            categoriesRepository.save(category);
        }
    }

    public List<Attribute> getCategoryAttributes(int categoryId) {
        Category category = categoriesRepository.findById(categoryId).orElseThrow(CategoryNotFoundException::new);
        return category.getAttributes();
    }
}
