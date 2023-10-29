package iljafatkulin.advertisement.portal.service;

import iljafatkulin.advertisement.portal.model.ProductAttributeValue;
import iljafatkulin.advertisement.portal.repositories.ProductAttributeValuesRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ProductAttributeValuesServiceTest {
    @Mock
    private ProductAttributeValuesRepository productAttributeValuesRepository;

    @InjectMocks
    private ProductAttributeValuesService productAttributeValuesService;

    @Test
    void testDeleteAll() {
        List<ProductAttributeValue> attributes = Collections.singletonList(new ProductAttributeValue("a1"));

        productAttributeValuesService.deleteAll(attributes);

        ArgumentCaptor<List<ProductAttributeValue>> argumentCaptor = ArgumentCaptor.forClass(List.class);
        verify(productAttributeValuesRepository).deleteAll(argumentCaptor.capture());
        assertEquals(attributes, argumentCaptor.getValue());
    }
}