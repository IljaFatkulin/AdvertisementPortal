package iljafatkulin.advertisement.portal.service;

import iljafatkulin.advertisement.portal.dao.ProductsDAO;
import iljafatkulin.advertisement.portal.exception.CategoryNotFoundException;
import iljafatkulin.advertisement.portal.model.Attribute;
import iljafatkulin.advertisement.portal.model.Category;
import iljafatkulin.advertisement.portal.model.Product;
import iljafatkulin.advertisement.portal.model.ProductAttributeValue;
import iljafatkulin.advertisement.portal.repositories.AttributesRepository;
import iljafatkulin.advertisement.portal.repositories.CategoriesRepository;
import iljafatkulin.advertisement.portal.repositories.ProductsRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.FlushModeType;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import iljafatkulin.advertisement.portal.dto.AttributeOptionsDTO;

import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;
import java.util.Map;
import java.util.HashMap;


@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CategoriesService {
    private final CategoriesRepository categoriesRepository;
    private final AttributesRepository attributesRepository;
    private final ProductsDAO productsDAO;

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

    public List<Attribute> getCategoryAttributes(String name) {
        Category category = categoriesRepository.findFirstByNameIgnoreCase(name).orElseThrow(CategoryNotFoundException::new);
        // List<Attribute> attributes = category.getAttributes();
        return category.getAttributes();

        // Map<Integer, Set<String>> attributeValuesMap = new HashMap<>();
        // List<ProductAttributeValue> t = new ArrayList<>();

        // for(Attribute attribute : attributes) {
        //     List<ProductAttributeValue> pavs = attribute.getProducts();
        //     Set<String> values = new HashSet<>();

        //     for(ProductAttributeValue pav : pavs) {
        //         String value = pav.getValue();
        //         values.add(value);
        //     }

        //     attributeValuesMap.put(attribute.getId(), values);
        // }

        // System.out.println(attributeValuesMap);
        // System.out.println(attributes);
        // return attributes;
    }

    public List<AttributeOptionsDTO> getCategoryAttributeOptions(String name) {
        Category category = categoriesRepository.findFirstByNameIgnoreCase(name).orElseThrow(CategoryNotFoundException::new);
        List<Attribute> attributes = category.getAttributes();

        List<AttributeOptionsDTO> attributeOptionsList = new ArrayList<>();

        for (Attribute attribute : attributes) {
            List<ProductAttributeValue> pavs = attribute.getProducts();
            Set<String> values = new HashSet<>();

            for (ProductAttributeValue pav : pavs) {
                String value = pav.getValue();
                values.add(value);
            }

            AttributeOptionsDTO dto = new AttributeOptionsDTO();
            dto.setId(attribute.getId());
            dto.setName(attribute.getName());
            dto.setOptions(new ArrayList<>(values));
            attributeOptionsList.add(dto);
        }

        // System.out.println(attributeOptionsList);
        return attributeOptionsList;
    }

    @Transactional
    public void deleteById(int id) {
        Category category = categoriesRepository.findById(id).orElseThrow(CategoryNotFoundException::new);
        Category other = categoriesRepository.findFirstByNameIgnoreCase("Without category").orElseThrow(RuntimeException::new);

        productsDAO.changeCategoryWhereCategoryIs(category, other);
        categoriesRepository.delete(category);
    }

    @Transactional
    public Category rename(int id, String name) {
        Category category = categoriesRepository.findById(id).orElseThrow(CategoryNotFoundException::new);

        if(categoriesRepository.findFirstByNameIgnoreCase(name).isPresent()) {
            throw new DuplicateKeyException("Category already exists");
        }

        category.setName(name);
        return category;
    }
}
