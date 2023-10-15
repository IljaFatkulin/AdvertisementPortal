package iljafatkulin.advertisement.portal.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import iljafatkulin.advertisement.portal.dto.AttributeDTO;
import iljafatkulin.advertisement.portal.dto.AttributeValueDTO;
import iljafatkulin.advertisement.portal.dto.ProductDTO;
import iljafatkulin.advertisement.portal.exceptions.CategoryNotFoundException;
import iljafatkulin.advertisement.portal.exceptions.ProductNotFoundException;
import iljafatkulin.advertisement.portal.forms.FormCreateProduct;
import iljafatkulin.advertisement.portal.forms.FormEditProduct;
import iljafatkulin.advertisement.portal.models.Attribute;
import iljafatkulin.advertisement.portal.models.Category;
import iljafatkulin.advertisement.portal.models.Product;
import iljafatkulin.advertisement.portal.services.AttributesService;
import iljafatkulin.advertisement.portal.services.CategoriesService;
import iljafatkulin.advertisement.portal.services.ProductsService;
import iljafatkulin.advertisement.portal.util.ObjectConverter;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProductController.class)
class ProductControllerTest {
    @MockBean
    private ProductsService productsService;

    @MockBean
    private CategoriesService categoriesService;

    @MockBean
    private AttributesService attributesService;

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testIndexWithOnlyCategoryName() throws Exception {
        // Setup categoriesService.findByName returns category
        Category category = new Category("category");
        category.setId(1);

        when(categoriesService.findByName(anyString())).thenReturn(category);

        // Setup productsService.findByCategoryId returns products list
        Product product1 = new Product("product1", 0, "d1");
        Product product2 = new Product("product2", 0, "d2");
        Product product3 = new Product("product3", 0, "d3");

        List<Product> products = List.of(product1, product2, product3);

        when(productsService.findByCategoryId(anyInt())).thenReturn(products);

        // Converting products list to expected json
        String expectedJson = objectMapper.writeValueAsString(ObjectConverter.convertList(products, ProductDTO.class));

        this.mockMvc.perform(get("/products?category={category}", category.getName()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));

        // Check whether CategoriesService.findByName is called
        ArgumentCaptor<String> categoryNameArgumentCaptor = ArgumentCaptor.forClass(String.class);
        verify(categoriesService).findByName(categoryNameArgumentCaptor.capture());
        assertEquals(category.getName(), categoryNameArgumentCaptor.getValue());

        // Check whether ProductsService.findByCategoryId is called
        ArgumentCaptor<Integer> categoryIdArgumentCaptor = ArgumentCaptor.forClass(Integer.class);
        verify(productsService).findByCategoryId(categoryIdArgumentCaptor.capture());
        assertEquals(category.getId(), categoryIdArgumentCaptor.getValue());
    }

    @Test
    void testIndexWithAllParameters() throws Exception {
        // Setup categoriesService.findByName returns category
        Category category = new Category("category");
        category.setId(1);

        when(categoriesService.findByName(anyString())).thenReturn(category);

        // Setup productsService.findByCategoryId returns products list
        Product product1 = new Product("product1", 0, "d1");

        List<Product> products = Collections.singletonList(product1);

        when(productsService.findByCategoryId(anyInt(), any(PageRequest.class))).thenReturn(products);

        // Converting products list to expected json
        String expectedJson = objectMapper.writeValueAsString(ObjectConverter.convertList(products, ProductDTO.class));

        int page = 3;
        int limit = 1;

        this.mockMvc.perform(get("/products?category={category}&page={page}&limit={limit}",
                category.getName(), page, limit))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));

        // Check whether ProductsService.findByCategoryId is called
        ArgumentCaptor<Integer> categoryIdArgumentCaptor = ArgumentCaptor.forClass(Integer.class);
        ArgumentCaptor<PageRequest> pageRequestArgumentCaptor = ArgumentCaptor.forClass(PageRequest.class);
        verify(productsService).findByCategoryId(categoryIdArgumentCaptor.capture(), pageRequestArgumentCaptor.capture());
        assertEquals(category.getId(), categoryIdArgumentCaptor.getValue());
        assertEquals(PageRequest.of(page, limit), pageRequestArgumentCaptor.getValue());
    }

    @Test
    void testIndexWhenCategoryDoesNotExists() throws Exception {
        // Setup CategoriesService throws exception
        when(categoriesService.findByName(anyString())).thenThrow(CategoryNotFoundException.class);

        this.mockMvc.perform(get("/products?category={category}", "test"))
                .andExpect(status().isNotFound());

        // Check whether ProductsService.findByCategoryId is not called
        verify(productsService, Mockito.never()).findByCategoryId(anyInt());
        verify(productsService, Mockito.never()).findByCategoryId(anyInt(), any(PageRequest.class));
    }

    @Test
    // should be 400 status
    void testIndexWithZeroParametersShouldBeStatusBadRequest() throws Exception {
        this.mockMvc.perform(get("/products"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testProductsCount() throws Exception {
        // Setup ProductsService.getProductsCountByCategory return count
        long count = 5L;

        when(productsService.getProductsCountByCategory(anyString())).thenReturn(count);

        // Converting count to expected json
        String expectedJson = objectMapper.writeValueAsString(count);

        String categoryName = "test";

        this.mockMvc.perform(get("/products/count?category={category}", categoryName))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));

        // Check whether ProductsService.getProductsCountByCategory is called
        ArgumentCaptor<String> categoryNameArgumentCaptor = ArgumentCaptor.forClass(String.class);
        verify(productsService).getProductsCountByCategory(categoryNameArgumentCaptor.capture());
        assertEquals(categoryName, categoryNameArgumentCaptor.getValue());
    }

    @Test
    // should be 400 status
    void testProductsCountWithZeroParametersShouldBeStatusBadRequest() throws Exception {
        this.mockMvc.perform(get("/products/count"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testProductInfo() throws Exception {
        // Setup ProductsService returns product
        Product product = new Product("product1", 1, "d1");
        product.addAttribute(new Attribute("attr1"), "value1");

        when(productsService.findById(anyInt())).thenReturn(product);

        // Converting product to expected json
        String expectedJson = objectMapper.writeValueAsString(ObjectConverter.convert(product, ProductDTO.class));

        int productId = 5;

        this.mockMvc.perform(get("/products/{id}", productId))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));

        // Check whether productsService.findById is called
        ArgumentCaptor<Integer> productIdArgumentCaptor = ArgumentCaptor.forClass(Integer.class);
        verify(productsService).findById(productIdArgumentCaptor.capture());
        assertEquals(productId, productIdArgumentCaptor.getValue());
    }

    @Test
    // should be 404 product not found
    void testProductInfoWhenProductDoesNotExists() throws Exception {
        // Setup ProductsService.findById throws exception
        when(productsService.findById(anyInt())).thenThrow(ProductNotFoundException.class);

        this.mockMvc.perform(get("/products/{id}", 1))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDelete() throws Exception {
        // Creating expected json
        String json = "{ \"id\": 1 }";

        this.mockMvc.perform(post("/products/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());

        ArgumentCaptor<Integer> argumentCaptor = ArgumentCaptor.forClass(Integer.class);
        verify(productsService).delete(argumentCaptor.capture());
        assertEquals(1, argumentCaptor.getValue());
    }

    @Test
    @Disabled
    void testEditWithAttributes() throws Exception {
        Product product = new Product("product1", 0, "d1");
        Category category = new Category("category1");
        product.setCategory(category);
        Attribute attribute = new Attribute("attr1");
        product.addAttribute(attribute, "value1");

        Product editedProduct = new Product("product1", 0, "d2");
        editedProduct.setCategory(category);

        // Setup form
        FormEditProduct form = new FormEditProduct();
        form.setId(1);
        form.setProduct(ObjectConverter.convert(editedProduct, ProductDTO.class));

        AttributeValueDTO attributeValueDTO = new AttributeValueDTO();
        attributeValueDTO.setAttribute(ObjectConverter.convert(attribute, AttributeDTO.class));
        attributeValueDTO.setValue("value1");
        form.setAttributes(Collections.singletonList(attributeValueDTO));

        // Setup ProductsRepository.findById returns Product
        when(productsService.findById(anyInt())).thenReturn(product);

        // Setup AttributesRepository.findByName returns Attribute
        when(attributesService.findByName(anyString())).thenReturn(attribute);

        // Converting form to json
        String json = objectMapper.writeValueAsString(form);

        this.mockMvc.perform(post("/products/edit")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());

        // Check whether ProductsService.findById is called
        ArgumentCaptor<Integer> productIdArgumentCaptor = ArgumentCaptor.forClass(Integer.class);
        verify(productsService).findById(productIdArgumentCaptor.capture());
        assertEquals(form.getId(), productIdArgumentCaptor.getValue());

        // Check whether ProductsService.clearFromAttributes is called
        ArgumentCaptor<Product> productArgumentCaptor = ArgumentCaptor.forClass(Product.class);
        verify(productsService).clearFromAttributes(productArgumentCaptor.capture());
        assertEquals(product, productArgumentCaptor.getValue());

        // Check whether AttributesService.findByName is called
        ArgumentCaptor<String> attributeNameArgumentCaptor = ArgumentCaptor.forClass(String.class);
        verify(attributesService).findByName(attributeNameArgumentCaptor.capture());
        assertEquals(attribute.getName(), attributeNameArgumentCaptor.getValue());

        // Check whether ProductsService.edit is called
        ArgumentCaptor<Product> editedProductArgumentCaptor = ArgumentCaptor.forClass(Product.class);
        verify(productsService).edit(editedProductArgumentCaptor.capture());
        assertEquals(editedProduct, editedProductArgumentCaptor.getValue());
    }

    @Test
    @Disabled
    void testEditWhenProductDoesNotExists() throws Exception {
        Product product = new Product("product1", 0, "d1");
        Category category = new Category("category1");
        product.setCategory(category);

        FormEditProduct form = new FormEditProduct();
        form.setId(1);
        form.setProduct(ObjectConverter.convert(product, ProductDTO.class));

        String json = objectMapper.writeValueAsString(form);

        when(productsService.findById(anyInt())).thenThrow(ProductNotFoundException.class);

        this.mockMvc.perform(post("/products/edit")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isNotFound());
    }

    @Test
    @Disabled
    // TODO
    void testCreateWithoutAttributes() throws Exception {
        byte[] imageBytes = new byte[] { 0x12, 0x34, 0x56, 0x78 };
        MockMultipartFile image = new MockMultipartFile("file", "test-image.jpg", "image/jpeg", imageBytes);

        // Setup form
        FormCreateProduct form = new FormCreateProduct();

        ProductDTO productDTO = new ProductDTO();
        productDTO.setName("product1");
        productDTO.setPrice(1);
        productDTO.setDescription("d1");

        form.setProduct(productDTO);
        form.setCategoryName("category1");

        // Setup CategoriesRepository.findByName
        Category category = new Category("category1");
        when(categoriesService.findByName(anyString())).thenReturn(category);

        // Converting form to json
        String json = objectMapper.writeValueAsString(form);

        this.mockMvc.perform(post("/products/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated());

        // Check whether CategoriesService.findByName is called
        ArgumentCaptor<String> categoryNameArgumentCaptor = ArgumentCaptor.forClass(String.class);
        verify(categoriesService).findByName(categoryNameArgumentCaptor.capture());
        assertEquals(form.getCategoryName(), categoryNameArgumentCaptor.getValue());

        // Check whether ProductsService.save is called
        ArgumentCaptor<Product> productArgumentCaptor = ArgumentCaptor.forClass(Product.class);
        ArgumentCaptor<MultipartFile> imageArgumentCaptor = ArgumentCaptor.forClass(MultipartFile.class);

        verify(productsService).save(productArgumentCaptor.capture(), imageArgumentCaptor.capture());


        // converting form.productDto to product
        Product expectedProduct = ObjectConverter.convert(productDTO, Product.class);
        assertEquals(expectedProduct, productArgumentCaptor.getValue());
    }

    @Test
    @Disabled
    // Should be bad request
    void testCreateWithWrongRequest() throws Exception {
        FormCreateProduct form = new FormCreateProduct();

        // Converting form to json
        String json = objectMapper.writeValueAsString(form);

        this.mockMvc.perform(post("/products/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Disabled
    // Should be not found
    void testCreateWhenCategoryDoesNotExists() throws Exception {
        // Setup form
        FormCreateProduct form = new FormCreateProduct();

        ProductDTO productDTO = new ProductDTO();
        productDTO.setName("product1");
        productDTO.setPrice(1);
        productDTO.setDescription("d1");

        form.setProduct(productDTO);
        form.setCategoryName("category1");

        // Converting form to json
        String json = objectMapper.writeValueAsString(form);

        // Setup CategoriesService.findByName throws error
        when(categoriesService.findByName(anyString())).thenThrow(CategoryNotFoundException.class);

        this.mockMvc.perform(post("/products/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isNotFound());


        verify(productsService, Mockito.never()).save(any(Product.class), any(MultipartFile.class));
    }
}