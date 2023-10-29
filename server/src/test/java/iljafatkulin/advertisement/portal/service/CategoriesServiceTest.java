package iljafatkulin.advertisement.portal.service;

import iljafatkulin.advertisement.portal.exception.CategoryNotFoundException;
import iljafatkulin.advertisement.portal.model.Attribute;
import iljafatkulin.advertisement.portal.model.Category;
import iljafatkulin.advertisement.portal.repositories.AttributesRepository;
import iljafatkulin.advertisement.portal.repositories.CategoriesRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CategoriesServiceTest {
    @Mock
    private CategoriesRepository categoriesRepository;

    @Mock
    private AttributesRepository attributesRepository;

    @InjectMocks
    private CategoriesService categoriesService;

    private Category category;

    @BeforeEach
    void setUp() {
        category = new Category("category1");
    }

    @Test
    void testFindAll() {
        Category category2 = new Category("category2");
        Category category3 = new Category("category3");
        List<Category> list = List.of(category, category2, category3);

        when(categoriesRepository.findAll()).thenReturn(list);

        List<Category> found = categoriesService.findAll();
        assertEquals(list, found);
    }

    @Test
    void testFindById() {
        when(categoriesRepository.findById(anyInt())).thenReturn(Optional.ofNullable(category));

        int id = 1;

        Category found = categoriesService.findById(id);
        assertEquals(category, found);

        ArgumentCaptor<Integer> argumentCaptor = ArgumentCaptor.forClass(Integer.class);
        verify(categoriesRepository).findById(argumentCaptor.capture());
        assertEquals(id, argumentCaptor.getValue());
    }

    @Test
    void testNotFoundFindById() {
        when(categoriesRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoriesService.findById(1))
                .isInstanceOf(CategoryNotFoundException.class)
                .hasMessageContaining("Category Not Found");
    }

    @Test
    void testFindByName() {
        when(categoriesRepository.findFirstByNameIgnoreCase(anyString())).thenReturn(Optional.ofNullable(category));

        String name = "category1";

        Category found = categoriesService.findByName(name);
        assertEquals(category, found);

        ArgumentCaptor<String> argumentCaptor = ArgumentCaptor.forClass(String.class);
        verify(categoriesRepository).findFirstByNameIgnoreCase(argumentCaptor.capture());
        assertEquals(name, argumentCaptor.getValue());
    }

    @Test
    void testNotFoundFindByName() {
        when(categoriesRepository.findFirstByNameIgnoreCase(anyString())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoriesService.findByName(""))
                .isInstanceOf(CategoryNotFoundException.class)
                .hasMessageContaining("Category Not Found");
    }

    @Test
    void testSave() {
        categoriesService.save(category);

        ArgumentCaptor<Category> argumentCaptor = ArgumentCaptor.forClass(Category.class);
        verify(categoriesRepository).save(argumentCaptor.capture());
        assertEquals(category, argumentCaptor.getValue());
    }

    @Test
    void testAddAttribute() {
        // Setup CategoriesRepository findById return category
        when(categoriesRepository.findById(anyInt())).thenReturn(Optional.ofNullable(category));

        // Setup AttributesRepository findFirstByName return attribute
        Attribute attribute = new Attribute("attribute");
        when(attributesRepository.findFirstByName(anyString())).thenReturn(Optional.of(attribute));

        int categoryId = 1;
        String attributeName = "attribute";
        categoriesService.addAttribute(categoryId, attributeName);

        // Category search testing
        ArgumentCaptor<Integer> categoryIdArgumentCaptor = ArgumentCaptor.forClass(Integer.class);
        verify(categoriesRepository).findById(categoryIdArgumentCaptor.capture());
        assertEquals(categoryId, categoryIdArgumentCaptor.getValue());

        // Attribute search testing
        ArgumentCaptor<String> attributeNameArgumentCaptor = ArgumentCaptor.forClass(String.class);
        verify(attributesRepository).findFirstByName(attributeNameArgumentCaptor.capture());
        assertEquals(attributeName, attributeNameArgumentCaptor.getValue());

        // Checking that AttributesRepository.save is not called
        verify(attributesRepository, Mockito.never()).save(any(Attribute.class));

        // Capturing Category object from CategoriesRepository.save
        ArgumentCaptor<Category> updatedCategoryArgumentCaptor = ArgumentCaptor.forClass(Category.class);
        verify(categoriesRepository).save(updatedCategoryArgumentCaptor.capture());

        Category updatedCategory = updatedCategoryArgumentCaptor.getValue();
        assertEquals(category, updatedCategory);

        // Checking whether attributes have been added
        assertEquals(List.of(attribute), updatedCategory.getAttributes());
    }

    @Test
    // Should throw exception
    void testAddAttributeWhenCategoryDoesNotExists() {
        when(categoriesRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoriesService.addAttribute(1, ""))
                .isInstanceOf(CategoryNotFoundException.class)
                .hasMessageContaining("Category Not Found");

        // Checking whether next methods are called
        verify(attributesRepository, Mockito.never()).findFirstByName(anyString());
        verify(attributesRepository, Mockito.never()).save(any(Attribute.class));
        verify(categoriesRepository, Mockito.never()).save(any(Category.class));
    }

    @Test
    // Should save new Attribute
    void testAddAttributeWhenAttributeDoesNotExists() {
        // Setup CategoriesRepository findById return category
        when(categoriesRepository.findById(anyInt())).thenReturn(Optional.ofNullable(category));

        // Setup AttributesRepository findFirstByName return null
        when(attributesRepository.findFirstByName(anyString())).thenReturn(Optional.empty());

        int categoryId = 1;
        String attributeName = "attribute";
        categoriesService.addAttribute(categoryId, attributeName);

        // Category search testing
        ArgumentCaptor<Integer> categoryIdArgumentCaptor = ArgumentCaptor.forClass(Integer.class);
        verify(categoriesRepository).findById(categoryIdArgumentCaptor.capture());
        assertEquals(categoryId, categoryIdArgumentCaptor.getValue());

        // Attribute search testing
        ArgumentCaptor<String> attributeNameArgumentCaptor = ArgumentCaptor.forClass(String.class);
        verify(attributesRepository).findFirstByName(attributeNameArgumentCaptor.capture());
        assertEquals(attributeName, attributeNameArgumentCaptor.getValue());

        // Checking whether attribute is saved in AttributesRepository
        Attribute attribute = new Attribute(attributeName);
        ArgumentCaptor<Attribute> attributeArgumentCaptor = ArgumentCaptor.forClass(Attribute.class);
        verify(attributesRepository).save(attributeArgumentCaptor.capture());
        assertEquals(attribute, attributeArgumentCaptor.getValue());

        // Capturing Category object from CategoriesRepository.save
        ArgumentCaptor<Category> updatedCategoryArgumentCaptor = ArgumentCaptor.forClass(Category.class);
        verify(categoriesRepository).save(updatedCategoryArgumentCaptor.capture());

        Category updatedCategory = updatedCategoryArgumentCaptor.getValue();
        assertEquals(category, updatedCategory);

        // Checking whether attributes have been added
        assertEquals(List.of(attribute), updatedCategory.getAttributes());
    }

    @Test
    void testRemoveAttribute() {
        // Setup CategoriesRepository findById return category
        when(categoriesRepository.findById(anyInt())).thenReturn(Optional.ofNullable(category));

        // Setup AttributesRepository findById return attribute
        Attribute attribute = new Attribute("attribute");
        when(attributesRepository.findById(anyInt())).thenReturn(Optional.of(attribute));

        int categoryId = 1;
        int attributeId = 2;

        category.addAttribute(attribute);

        categoriesService.removeAttribute(categoryId, attributeId);

        // Category search testing
        ArgumentCaptor<Integer> categoryIdArgumentCaptor = ArgumentCaptor.forClass(Integer.class);
        verify(categoriesRepository).findById(categoryIdArgumentCaptor.capture());
        assertEquals(categoryId, categoryIdArgumentCaptor.getValue());

        // Attribute search testing
        ArgumentCaptor<Integer> attributeIdArgumentCaptor = ArgumentCaptor.forClass(Integer.class);
        verify(attributesRepository).findById(attributeIdArgumentCaptor.capture());
        assertEquals(attributeId, attributeIdArgumentCaptor.getValue());

        // Capturing Category object from CategoriesRepository.save
        ArgumentCaptor<Category> categoryArgumentCaptor = ArgumentCaptor.forClass(Category.class);
        verify(categoriesRepository).save(categoryArgumentCaptor.capture());

        Category capturedCategory = categoryArgumentCaptor.getValue();
        assertEquals(category, capturedCategory);

        if(category.getAttributes() != null) {
            assertFalse(capturedCategory.getAttributes().contains(attribute));
        }
    }

    @Test
    // Should throw exception
    void testRemoveAttributeWhenCategoryDoesNotExists() {
        when(categoriesRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoriesService.removeAttribute(1, 2))
                .isInstanceOf(CategoryNotFoundException.class)
                .hasMessageContaining("Category Not Found");

        // Checking whether next methods are called
        verify(attributesRepository, Mockito.never()).findById(anyInt());
        verify(categoriesRepository, Mockito.never()).save(any(Category.class));
    }

    @Test
    // When attribute is null
    void testRemoveAttributeWhenAttributeDoesNotExists() {
        when(categoriesRepository.findById(anyInt())).thenReturn(Optional.ofNullable(category));
        when(attributesRepository.findById(anyInt())).thenReturn(Optional.empty());

        categoriesService.removeAttribute(1, 2);

        verify(categoriesRepository, Mockito.never()).save(any(Category.class));
    }

    @Test
    void testGetCategoryAttributes() {
        // Setup CategoriesRepository findById return category with attributes
        Attribute attribute1 = new Attribute("attr1");
        Attribute attribute2 = new Attribute("attr2");
        List<Attribute> attributes = List.of(attribute1, attribute2);
        category.setAttributes(attributes);

        when(categoriesRepository.findById(anyInt())).thenReturn(Optional.ofNullable(category));

        int categoryId = 1;

        // Fetching attributes and comparing
        List<Attribute> fetchedAttributes = categoriesService.getCategoryAttributes(categoryId);
        assertEquals(attributes, fetchedAttributes);

        // Category search testing
        ArgumentCaptor<Integer> categoryIdArgumentCaptor = ArgumentCaptor.forClass(Integer.class);
        verify(categoriesRepository).findById(categoryIdArgumentCaptor.capture());
        assertEquals(categoryId, categoryIdArgumentCaptor.getValue());
    }

    @Test
    // Should throw exception
    void testGetCategoryAttributesWhenCategoryDoesNotExists() {
        when(categoriesRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoriesService.getCategoryAttributes(1))
                .isInstanceOf(CategoryNotFoundException.class)
                .hasMessageContaining("Category Not Found");
    }
}