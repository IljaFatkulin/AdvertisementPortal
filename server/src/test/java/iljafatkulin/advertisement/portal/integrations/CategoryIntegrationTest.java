package iljafatkulin.advertisement.portal.integrations;

import com.fasterxml.jackson.databind.ObjectMapper;
import iljafatkulin.advertisement.portal.AdvertisementPortalApplication;
import iljafatkulin.advertisement.portal.dto.AttributeDTO;
import iljafatkulin.advertisement.portal.dto.CategoryDTO;
import iljafatkulin.advertisement.portal.request.FormAddCategoryAttribute;
import iljafatkulin.advertisement.portal.request.FormCreateCategory;
import iljafatkulin.advertisement.portal.request.FormRemoveCategoryAttribute;
import iljafatkulin.advertisement.portal.model.Category;
import iljafatkulin.advertisement.portal.repositories.CategoriesRepository;
import iljafatkulin.advertisement.portal.service.CategoriesService;
import iljafatkulin.advertisement.portal.util.ObjectConverter;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


//@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = AdvertisementPortalApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
public class CategoryIntegrationTest {
//    @LocalServerPort
//    private int port;

//    private static RestTemplate restTemplate;

//    private String baseUrl = "http://localhost";
    @Autowired
    private MockMvc mockMvc;

    private Category category1;
    private Category category2;
    private List<Category> categories;

    @Autowired
    private CategoriesRepository categoriesRepository;

    @Autowired
    private CategoriesService categoriesService;

    @Autowired
    private ObjectMapper objectMapper;

//    @BeforeAll
//    static void beforeAll() {
//        restTemplate = new RestTemplate();
//    }

    @BeforeEach
    void setUp() {
//        baseUrl = baseUrl + ":" + port + "/categories";

        category1 = new Category("category1");
        category2 = new Category("category2");
        categories = List.of(category1, category2);
    }

    @AfterEach
    void tearDown() {
        categoriesRepository.deleteAll();
    }

    @Test
    void testIndex() throws Exception {
        categoriesRepository.saveAll(categories);

//        List<CategoryDTO> categoriesDTO = converter.convertToCategoryDTOList(categories);
        List<CategoryDTO> categoriesDTO = ObjectConverter.convertList(categories, CategoryDTO.class);

        // Converting categoriesDTO to expected json
        String expectedJson = objectMapper.writeValueAsString(categoriesDTO);

//        String response = restTemplate.getForObject(baseUrl + "/", String.class);
        this.mockMvc.perform(get("/categories"))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
//        assertEquals(expectedJson, response);
    }

    @Test
    void testCreate() throws Exception {
        FormCreateCategory form = new FormCreateCategory();
        form.setName("category3");

        // Converting form to json
        String json = objectMapper.writeValueAsString(form);

        this.mockMvc.perform(post("/categories/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isCreated());


        // Fetching all categories to check is there the new category
        Category c = categoriesRepository.findFirstByNameIgnoreCase("category3").orElse(null);
        String expectedJson = objectMapper.writeValueAsString(ObjectConverter.convertList(List.of(c), CategoryDTO.class));

        this.mockMvc.perform(get("/categories"))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    // should be bad request
    void testCreateWithWrongRequest() throws Exception {
        FormCreateCategory form = new FormCreateCategory();

        // Converting form to json
        String json = objectMapper.writeValueAsString(form);

        this.mockMvc.perform(post("/categories/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testCategoryInfoWithoutAttributes() throws Exception {
        category1 = categoriesRepository.save(category1);
        category1.setAttributes(Collections.emptyList());

        // Converting category1 to expected json
        String expectedJson = objectMapper.writeValueAsString(ObjectConverter.convert(category1, CategoryDTO.class));

        this.mockMvc.perform(get("/categories/{id}", category1.getId()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    @Transactional
    void testCategoryInfoWithAttributes() throws Exception {
        category1 = categoriesRepository.save(category1);

        categoriesService.addAttribute(category1.getId(), "attr1");


        // Converting category1 to expectedJson
        String expectedJson = objectMapper.writeValueAsString(ObjectConverter.convert(category1, CategoryDTO.class));

        this.mockMvc.perform(get("/categories/{id}", category1.getId()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    // Should be 404 status
    void testCategoryInfoWhenCategoryDoesNotExists() throws Exception {
        String expected = "Category Not Found";

        this.mockMvc.perform(get("/categories/{id}", 1))
                .andExpect(status().isNotFound())
                .andExpect(content().string(expected));
    }

    @Test
    @Transactional
    void testCategoryAttributes() throws Exception {
        category1 = categoriesRepository.save(category1);
        categoriesService.addAttribute(category1.getId(), "attr1");
        categoriesService.addAttribute(category1.getId(), "attr2");

        // Creating attributes list with attributeName1 and 2, converting list to AttributeDTOList
        List<AttributeDTO> attributes = ObjectConverter.convertList(category1.getAttributes(), AttributeDTO.class);

        // Converting attributes to expected json
        String expectedJson = objectMapper.writeValueAsString(attributes);

        this.mockMvc.perform(get("/categories/{id}/attributes", category1.getId()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void testCategoryAttributesWhenAttributesIsEmpty() throws Exception {
        category1 = categoriesRepository.save(category1);

        String expectedJson = "[]";

        this.mockMvc.perform(get("/categories/{id}/attributes", category1.getId()))
                .andExpect(status().isOk())
                .andExpect(content().json(expectedJson));
    }

    @Test
    void testCategoryAttributesWhenCategoryDoesNotExists() throws Exception {
        String expected = "Category Not Found";

        this.mockMvc.perform(get("/categories/{id}/attributes", 1))
                .andExpect(status().isNotFound())
                .andExpect(content().string(expected));
    }

    @Test
    @Transactional
    void testRemoveAttributeFromCategory() throws Exception {
        category1 = categoriesRepository.save(category1);
        categoriesService.addAttribute(category1.getId(), "attr1");

        FormRemoveCategoryAttribute form = new FormRemoveCategoryAttribute();
        form.setCategoryId(category1.getId());
        form.setAttributeId(category1.getAttributes().get(0).getId());

        // Converting form to json
        String json = objectMapper.writeValueAsString(form);

        this.mockMvc.perform(post("/categories/attribute/remove")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());

        assertEquals(Collections.emptyList(), category1.getAttributes());
    }

    @Test
    void testRemoveAttributeFromCategoryWhenAttributeDoesNotExists() throws Exception {
        category1 = categoriesRepository.save(category1);

        FormRemoveCategoryAttribute form = new FormRemoveCategoryAttribute();
        form.setCategoryId(category1.getId());
        form.setAttributeId(9);

        // Converting form to json
        String json = objectMapper.writeValueAsString(form);

        this.mockMvc.perform(post("/categories/attribute/remove")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());
    }

    @Test
    void testRemoveAttributeFromCategoryWithWrongRequest() throws Exception {
        this.mockMvc.perform(post("/categories/attribute/remove")
                .contentType(MediaType.APPLICATION_JSON)
                .content(""))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testRemoveAttributeFromCategoryWhenCategoryDoesNotExists() throws Exception {
        FormRemoveCategoryAttribute form = new FormRemoveCategoryAttribute();
        form.setCategoryId(1);
        form.setAttributeId(1);

        // Converting form to json
        String json = objectMapper.writeValueAsString(form);

        String expected = "Category Not Found";

        this.mockMvc.perform(post("/categories/attribute/remove")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isNotFound())
                .andExpect(content().string(expected));
    }

    @Test
    @Transactional
    void testAddAttributeToCategory() throws Exception {
        category1 = categoriesRepository.save(category1);

        FormAddCategoryAttribute form = new FormAddCategoryAttribute();
        form.setCategoryId(category1.getId());
        form.setAttributeName("attr1");

        // Converting form to json
        String json = objectMapper.writeValueAsString(form);

        this.mockMvc.perform(post("/categories/attribute/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());

        assertEquals(form.getAttributeName(), category1.getAttributes().get(0).getName());
    }

    @Test
    void testAddAttributeToCategoryWithWrongRequest() throws Exception {
        this.mockMvc.perform(post("/categories/attribute/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(""))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testAddAttributeToCategoryWhenCategoryDoesNotExists() throws Exception {
        FormAddCategoryAttribute form = new FormAddCategoryAttribute();
        form.setCategoryId(5);
        form.setAttributeName("attr1");

        // Converting form to json
        String json = objectMapper.writeValueAsString(form);

        String expected = "Category Not Found";


        this.mockMvc.perform(post("/categories/attribute/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isNotFound())
                .andExpect(content().string(expected));
    }
}
