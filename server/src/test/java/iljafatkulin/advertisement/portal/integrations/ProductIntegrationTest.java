package iljafatkulin.advertisement.portal.integrations;

import com.fasterxml.jackson.databind.ObjectMapper;
import iljafatkulin.advertisement.portal.AdvertisementPortalApplication;
import iljafatkulin.advertisement.portal.dto.AttributeValueDTO;
import iljafatkulin.advertisement.portal.dto.ProductDTO;
import iljafatkulin.advertisement.portal.request.FormCreateProduct;
import iljafatkulin.advertisement.portal.request.FormEditProduct;
import iljafatkulin.advertisement.portal.model.Attribute;
import iljafatkulin.advertisement.portal.model.Category;
import iljafatkulin.advertisement.portal.model.Product;
import iljafatkulin.advertisement.portal.model.ProductAttributeValue;
import iljafatkulin.advertisement.portal.repositories.AttributesRepository;
import iljafatkulin.advertisement.portal.repositories.CategoriesRepository;
import iljafatkulin.advertisement.portal.repositories.ProductsRepository;
import iljafatkulin.advertisement.portal.util.ObjectConverter;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = AdvertisementPortalApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class ProductIntegrationTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductsRepository productsRepository;

    @Autowired
    private CategoriesRepository categoriesRepository;

    @Autowired
    private AttributesRepository attributesRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private Product product1;
    private Product product2;
    private List<Product> products;

    @BeforeEach
    void setUp() {
        product1 = new Product("product1", 5, "d1");
        product2 = new Product("product2", 3, "d2");
        products = List.of(product1, product2);
    }

    @AfterEach
    void tearDown() {
        productsRepository.deleteAll();
        categoriesRepository.deleteAll();
        attributesRepository.deleteAll();
    }

    @Transactional
    protected void saveCategoryAndAddToProduct(Category category) {
        category = categoriesRepository.save(category);

        product1.setCategory(category);
        product2.setCategory(category);
        products = productsRepository.saveAll(List.of(product1, product2));
        product1 = products.get(0);
        product2 = products.get(1);
    }
    
    @Test
    @Transactional
    void testIndexWithCategoryName() throws Exception {
        Category category = new Category("category1");
        
        saveCategoryAndAddToProduct(category);

        // Converting products to expected json
        String expectedJson = objectMapper.writeValueAsString(ObjectConverter.convertList(products, ProductDTO.class));

        this.mockMvc.perform(get("/products?category={category}", category.getName()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }
    
    @Test
    @Transactional
    void testIndexWithAllParameters() throws Exception {
        Category category = new Category("category1");

        saveCategoryAndAddToProduct(category);

        String expectedJson = objectMapper.writeValueAsString(ObjectConverter.convertList(Collections.singletonList(product1), ProductDTO.class));

        this.mockMvc.perform(get("/products?category={category}&page={page}&limit={limit}", category.getName(), 0, 1))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void testIndexWhenCategoryDoesNotExists() throws Exception {
        String expected = "Category Not Found";

        this.mockMvc.perform(get("/products?category={category}", "test"))
                .andExpect(status().isNotFound())
                .andExpect(content().string(expected));
    }

    @Test
    void testIndexWithWrongRequest() throws Exception {
        this.mockMvc.perform(get("/products"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    void testProductsCount() throws Exception {
        Category category = new Category("category1");
        saveCategoryAndAddToProduct(category);

        String expected = String.valueOf(products.size());

        this.mockMvc.perform(get("/products/count?category={category}", category.getName()))
                .andExpect(status().isOk())
                .andExpect(content().string(expected));
    }

    @Test
    void testProductsCountWhenCategoryDoesNotExists() throws Exception {
        this.mockMvc.perform(get("/products/count?category={category}", "test"))
                .andExpect(status().isOk())
                .andExpect(content().string("0"));
    }

    @Test
    void testProductsCountWithWrongRequest() throws Exception {
        this.mockMvc.perform(get("/products/count"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    void testProductInfo() throws Exception {
        product1 = productsRepository.save(product1);

        product1.addAttribute(new Attribute("attr1"), "value1");

        // Converting product1 to expected json
        String expectedJson = objectMapper.writeValueAsString(ObjectConverter.convert(product1, ProductDTO.class));

        this.mockMvc.perform(get("/products/{id}", product1.getId()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void testProductInfoWhenProductDoesNotExists() throws Exception {
        String expected = "Product Not Found";

        this.mockMvc.perform(get("/products/{id}", 1))
                .andExpect(status().isNotFound())
                .andExpect(content().string(expected));
    }

    @Test
    @Transactional
    void testDelete() throws Exception {
        Category category = new Category("category1");
        saveCategoryAndAddToProduct(category);

        int id = product1.getId();

        String json = "{\"id\":" + id + "}";

        this.mockMvc.perform(post("/products/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());

        assertEquals(Optional.empty() ,productsRepository.findById(id));
    }

    @Test
    void testDeleteWithWrongRequest() throws Exception {
        this.mockMvc.perform(post("/products/delete"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    @Disabled
    void testEdit() throws Exception {
        product1 = productsRepository.save(product1);
        product1.addAttribute(new Attribute("attr1"), "value1");

        FormEditProduct form = new FormEditProduct();
        form.setId(product1.getId());
        form.setProduct(ObjectConverter.convert(product1, ProductDTO.class));
        form.getProduct().setDescription("d33");

        Attribute attribute = new Attribute("attr1");
        attribute = attributesRepository.save(attribute);

        ProductAttributeValue productAttributeValue = new ProductAttributeValue();
        productAttributeValue.setAttribute(attribute);
        productAttributeValue.setValue("val1");

        form.setAttributes(Collections.singletonList(ObjectConverter.convert(productAttributeValue, AttributeValueDTO.class)));

        // Converting form to json
        String json = objectMapper.writeValueAsString(form);

        this.mockMvc.perform(post("/products/edit")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());

        Product updatedProduct = productsRepository.findById(product1.getId()).orElse(null);

        assertEquals(product1, updatedProduct);
        assertEquals(productAttributeValue.getAttribute().getName(), updatedProduct.getAttributes().get(0).getAttribute().getName());
        assertEquals(productAttributeValue.getValue(), updatedProduct.getAttributes().get(0).getValue());
    }

    @Test
    @Disabled
    void testEditWhenProductDoesNotExists() throws Exception {
        FormEditProduct form = new FormEditProduct();
        form.setId(1);
        form.setProduct(ObjectConverter.convert(product1, ProductDTO.class));

        String json = objectMapper.writeValueAsString(form);

        String expected = "Product Not Found";

        this.mockMvc.perform(post("/products/edit")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isNotFound())
                .andExpect(content().string(expected));
    }

    @Test
    void testEditWithWrongRequest() throws Exception {
        this.mockMvc.perform(post("/products/edit"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    @Disabled
    void testCreate() throws Exception {
        Category category = new Category("category1");
        category = categoriesRepository.save(category);

        FormCreateProduct form = new FormCreateProduct();
        form.setCategoryName(category.getName());
        form.setProduct(ObjectConverter.convert(product1, ProductDTO.class));

        Attribute attribute = new Attribute("attr1");
        attribute = attributesRepository.save(attribute);

        ProductAttributeValue productAttributeValue = new ProductAttributeValue();
        productAttributeValue.setAttribute(attribute);
        productAttributeValue.setValue("val1");

        form.setAttributes(Collections.singletonList(ObjectConverter.convert(productAttributeValue, AttributeValueDTO.class)));

        // Converting form to json
        String json = objectMapper.writeValueAsString(form);

        product1.setAttributes(Collections.singletonList(productAttributeValue));

        this.mockMvc.perform(post("/products/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated());

//        product1.setId(1);

        Product createdProduct = productsRepository.findAll().get(0);

//        assertEquals(product1, updatedProduct);
        assertEquals(product1.getName(), createdProduct.getName());
        assertEquals(product1.getPrice(), createdProduct.getPrice());
        assertEquals(product1.getDescription(), createdProduct.getDescription());
        assertEquals(productAttributeValue.getAttribute().getName(), createdProduct.getAttributes().get(0).getAttribute().getName());
        assertEquals(productAttributeValue.getValue(), createdProduct.getAttributes().get(0).getValue());
    }

    @Test
    @Disabled
    void testCreateWithWrongRequest() throws Exception {
        this.mockMvc.perform(post("/products/create"))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Disabled
    void testCreateWhenCategoryDoesNotExists() throws Exception {
        FormCreateProduct form = new FormCreateProduct();
        form.setCategoryName("test");
        form.setProduct(ObjectConverter.convert(product1, ProductDTO.class));

        // Converting form to json
        String json = objectMapper.writeValueAsString(form);

        String expected = "Category Not Found";

        this.mockMvc.perform(post("/products/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isNotFound())
                .andExpect(content().string(expected));
    }
}
