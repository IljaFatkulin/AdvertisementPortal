package iljafatkulin.advertisement.portal.services;

import iljafatkulin.advertisement.portal.exceptions.ProductNotFoundException;
import iljafatkulin.advertisement.portal.models.Product;
import iljafatkulin.advertisement.portal.models.ProductAttributeValue;
import iljafatkulin.advertisement.portal.repositories.ProductAttributeValuesRepository;
import iljafatkulin.advertisement.portal.repositories.ProductsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductsServiceTest {
    @Mock
    private ProductsRepository productsRepository;

    @Mock
    private ProductAttributeValuesRepository productAttributeValuesRepository;

    @InjectMocks
    private ProductsService productsService;

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product("product1", 0, "d1");
    }

    @Test
    void testFindAll() {
        when(productsRepository.findAll()).thenReturn(Collections.singletonList(product));

        List<Product> products = productsService.findAll();
        assertThat(products).isEqualTo(Collections.singletonList(product));

        verify(productsRepository).findAll();
    }

    @Test
    void testGetProductsCountByCategory() {
        when(productsRepository.countByCategoryName(any())).thenReturn(2L);

        long count = productsService.getProductsCountByCategory("cars");
        assertThat(count).isEqualTo(2L);

        ArgumentCaptor<String> stringArgumentCaptor = ArgumentCaptor.forClass(String.class);
        verify(productsRepository).countByCategoryName(stringArgumentCaptor.capture());
        assertThat(stringArgumentCaptor.getValue()).isEqualTo("cars");

        assertEquals("cars", stringArgumentCaptor.getValue());
    }

    @Test
    void testFindByCategoryId() {
        when(productsRepository.findByCategoryIdOrderById(anyInt())).thenReturn(Collections.singletonList(product));

        int categoryId = 1;

        List<Product> products = productsService.findByCategoryId(categoryId);
        assertThat(products).isEqualTo(Collections.singletonList(product));

        ArgumentCaptor<Integer> argumentCaptor = ArgumentCaptor.forClass(Integer.class);
        verify(productsRepository).findByCategoryIdOrderById(argumentCaptor.capture());
        assertThat(argumentCaptor.getValue()).isEqualTo(categoryId);
    }

    @Test
    void testFindByCategoryIdAndPageRequest() {
        when(productsRepository.findByCategoryIdOrderById(anyInt(), any(PageRequest.class)))
                .thenReturn(new PageImpl<>(Collections.singletonList(product)));

        List<Product> products = productsService.findByCategoryId(1, PageRequest.of(1, 1));
        assertThat(products).isEqualTo(Collections.singletonList(product));

        ArgumentCaptor<Integer> idArgumentCaptor = ArgumentCaptor.forClass(Integer.class);
        ArgumentCaptor<PageRequest> pageRequestArgumentCaptor = ArgumentCaptor.forClass(PageRequest.class);

        verify(productsRepository).findByCategoryIdOrderById(idArgumentCaptor.capture(), pageRequestArgumentCaptor.capture());
        assertThat(idArgumentCaptor.getValue()).isEqualTo(1);
        assertThat(pageRequestArgumentCaptor.getValue()).isEqualTo(PageRequest.of(1, 1));
    }

    @Test
    void testFindById() {
        when(productsRepository.findById(anyInt())).thenReturn(Optional.of(product));

        int id = 1;

        Product foundProduct = productsService.findById(id);
        assertThat(foundProduct).isEqualTo(product);

        ArgumentCaptor<Integer> idArgumentCaptor = ArgumentCaptor.forClass(Integer.class);
        verify(productsRepository).findById(idArgumentCaptor.capture());
        assertThat(idArgumentCaptor.getValue()).isEqualTo(id);
    }

    @Test
    void testNotFoundFindById() {
        when(productsRepository.findById(anyInt())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productsService.findById(1))
                .isInstanceOf(ProductNotFoundException.class)
                .hasMessageContaining("Product Not Found");
    }

    @Test
    void testSave() throws IOException {
        byte[] imageBytes = new byte[] { 0x12, 0x34, 0x56, 0x78 };
        MockMultipartFile image = new MockMultipartFile("file", "test-image.jpg", "image/jpeg", imageBytes);

        productsService.save(product, image);
        File savedFile = new File("/Users/iljafatkulin/IdeaProjects/Advertisement-Portal/images" + product.getAvatarPath());

        ArgumentCaptor<Product> productArgumentCaptor = ArgumentCaptor.forClass(Product.class);
        verify(productsRepository).save(productArgumentCaptor.capture());

        Product capturedProduct = productArgumentCaptor.getValue();

        assertNotNull(capturedProduct.getCreatedAt());
        assertNotNull(capturedProduct.getUpdatedAt());
        assertThat(capturedProduct).isEqualTo(product);
        byte[] savedFileBytes = Files.readAllBytes(savedFile.toPath());
        savedFile.delete();
        assertArrayEquals(imageBytes, savedFileBytes);
    }

    @Test
    void testDeleteById() {
        int id = 1;

        productsService.delete(id);

        ArgumentCaptor<Integer> argumentCaptor = ArgumentCaptor.forClass(Integer.class);
        verify(productsRepository).deleteById(argumentCaptor.capture());

        int captured = argumentCaptor.getValue();

        assertThat(captured).isEqualTo(id);
    }

    @Test
    void testDelete() {
        productsService.delete(product);

        ArgumentCaptor<Product> argumentCaptor = ArgumentCaptor.forClass(Product.class);
        verify(productsRepository).delete(argumentCaptor.capture());

        assertThat(argumentCaptor.getValue()).isEqualTo(product);
    }

    @Test
    void testEdit() {
        productsService.edit(product);

        ArgumentCaptor<Product> productArgumentCaptor = ArgumentCaptor.forClass(Product.class);
        verify(productsRepository).save(productArgumentCaptor.capture());

        Product capturedProduct = productArgumentCaptor.getValue();

        assertNotNull(capturedProduct.getCreatedAt());
        assertNotNull(capturedProduct.getUpdatedAt());
        assertThat(capturedProduct).isEqualTo(product);
    }

    @Test
    void testClearFromAttributes() {
        List<ProductAttributeValue> attributes = new ArrayList<>();
        attributes.add(new ProductAttributeValue("test"));
        product.setAttributes(attributes);

        productsService.clearFromAttributes(product);

        ArgumentCaptor<List<ProductAttributeValue>> listArgumentCaptor
                = ArgumentCaptor.forClass(List.class);

        verify(productAttributeValuesRepository).deleteAll(listArgumentCaptor.capture());

        assertThat(listArgumentCaptor.getValue()).isEqualTo(product.getAttributes());

        ArgumentCaptor<Product> productArgumentCaptor = ArgumentCaptor.forClass(Product.class);
        verify(productsRepository).save(productArgumentCaptor.capture());

        Product capturedProduct = productArgumentCaptor.getValue();

        assertThat(capturedProduct).isEqualTo(product);
        assertThat(capturedProduct.getAttributes().isEmpty()).isTrue();
    }
}