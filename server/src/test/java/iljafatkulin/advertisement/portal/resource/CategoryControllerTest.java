package iljafatkulin.advertisement.portal.resource;

import com.fasterxml.jackson.databind.ObjectMapper;
import iljafatkulin.advertisement.portal.dto.AttributeDTO;
import iljafatkulin.advertisement.portal.dto.CategoryDTO;
import iljafatkulin.advertisement.portal.exception.CategoryNotFoundException;
import iljafatkulin.advertisement.portal.request.FormAddCategoryAttribute;
import iljafatkulin.advertisement.portal.request.FormCreateCategory;
import iljafatkulin.advertisement.portal.request.FormRemoveCategoryAttribute;
import iljafatkulin.advertisement.portal.model.Attribute;
import iljafatkulin.advertisement.portal.model.Category;
import iljafatkulin.advertisement.portal.service.CategoriesService;
import iljafatkulin.advertisement.portal.util.ObjectConverter;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CategoryResource.class)
public class CategoryControllerTest {
    @MockBean
    private CategoriesService categoriesService;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testIndex() throws Exception {
        // Setup CategoriesService return list
        Category category1 = new Category("category1");
        Category category2 = new Category("category2");
        List<Category> list = List.of(category1, category2);

        when(categoriesService.findAll()).thenReturn(list);

        // Converting list to expected json
        String expectedJson = objectMapper.writeValueAsString(ObjectConverter.convertList(list, CategoryDTO.class));

        this.mockMvc.perform(get("/categories"))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void testCreate() throws Exception {
        // Setup form for post
        FormCreateCategory form = new FormCreateCategory();
        form.setName("test");

        this.mockMvc.perform(post("/categories/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(form)))
                .andExpect(status().isCreated());

        // Check whether categoriesService.save is called
        ArgumentCaptor<Category> categoryNameArgumentCaptor = ArgumentCaptor.forClass(Category.class);
        verify(categoriesService).save(categoryNameArgumentCaptor.capture());
        assertEquals(form.getName(), categoryNameArgumentCaptor.getValue().getName());
    }

    @Test
    void testCreateWithWrongRequest() throws Exception {
        this.mockMvc.perform(post("/categories/create"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testCategoryInfo() throws Exception {
        // Setup CategoriesService return category
        Category category = new Category("category1");

        when(categoriesService.findById(anyInt())).thenReturn(category);

        // Converting category to expected json
        String expectedJson = objectMapper.writeValueAsString(ObjectConverter.convert(category, CategoryDTO.class));

        this.mockMvc.perform(get("/categories/{id}", 1))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void testCategoryInfoWhenCategoryDoesNotExists() throws Exception {
        // Setup CategoriesService throw exception
        when(categoriesService.findById(anyInt())).thenThrow(CategoryNotFoundException.class);

        this.mockMvc.perform(get("/categories/{id}", 1))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCategoryAttributes() throws Exception {
        // Setup CategoriesService return list of attributes
        Attribute attribute1 = new Attribute("attr1");
        Attribute attribute2 = new Attribute("attr2");
        List<Attribute> list = List.of(attribute1, attribute2);

        when(categoriesService.getCategoryAttributes(anyInt())).thenReturn(list);

        // Converting list to expected json
        String expectedJson = objectMapper.writeValueAsString(ObjectConverter.convertList(list, AttributeDTO.class));

        this.mockMvc.perform(get("/categories/{id}/attributes", 1))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void testCategoryAttributesWhenCategoryDoesNotExists() throws Exception {
        // Setup CategoriesService throw exception
        when(categoriesService.getCategoryAttributes(anyInt())).thenThrow(CategoryNotFoundException.class);

        this.mockMvc.perform(get("/categories/{id}/attributes", 1))
                .andExpect(status().isNotFound());
    }

    @Test
    void testRemoveAttributeFromCategory() throws Exception {
        // Setup form for post
        FormRemoveCategoryAttribute form = new FormRemoveCategoryAttribute();
        form.setCategoryId(1);
        form.setAttributeId(2);

        this.mockMvc.perform(post("/categories/attribute/remove")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(form)))
                .andExpect(status().isOk());

        ArgumentCaptor<Integer> categoryIdArgumentCaptor = ArgumentCaptor.forClass(Integer.class);
        ArgumentCaptor<Integer> attributeIdArgumentCaptor = ArgumentCaptor.forClass(Integer.class);

        // Check whether categoriesService.removeAttribute is called
        verify(categoriesService).removeAttribute(categoryIdArgumentCaptor.capture(), attributeIdArgumentCaptor.capture());
        assertEquals(form.getCategoryId(), categoryIdArgumentCaptor.getValue());
        assertEquals(form.getAttributeId(), attributeIdArgumentCaptor.getValue());
    }

    @Test
    void testAddAttributeToCategory() throws Exception {
        FormAddCategoryAttribute form = new FormAddCategoryAttribute();
        form.setCategoryId(1);
        form.setAttributeName("test");

        this.mockMvc.perform(post("/categories/attribute/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(form)))
                .andExpect(status().isOk());

        ArgumentCaptor<Integer> categoryIdArgumentCaptor = ArgumentCaptor.forClass(Integer.class);
        ArgumentCaptor<String> attributeNameArgumentCaptor = ArgumentCaptor.forClass(String.class);

        // Check whether categoriesService.addAttribute is called
        verify(categoriesService).addAttribute(categoryIdArgumentCaptor.capture(), attributeNameArgumentCaptor.capture());
        assertEquals(form.getCategoryId(), categoryIdArgumentCaptor.getValue());
        assertEquals(form.getAttributeName(), attributeNameArgumentCaptor.getValue());
    }

    @Test
    void testAddAttributeToCategoryWhenCategoryDoesNotExists() throws Exception {
        doThrow(CategoryNotFoundException.class)
                .when(categoriesService).addAttribute(anyInt(), anyString());

        FormAddCategoryAttribute form = new FormAddCategoryAttribute();
        form.setCategoryId(1);
        form.setAttributeName("test");

        this.mockMvc.perform(post("/categories/attribute/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(form)))
                .andExpect(status().isNotFound());
    }
}
