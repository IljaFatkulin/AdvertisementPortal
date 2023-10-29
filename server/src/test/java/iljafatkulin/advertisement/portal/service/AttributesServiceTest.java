package iljafatkulin.advertisement.portal.service;

import iljafatkulin.advertisement.portal.model.Attribute;
import iljafatkulin.advertisement.portal.repositories.AttributesRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AttributesServiceTest {
    @Mock
    private AttributesRepository attributesRepository;

    @InjectMocks
    private AttributesService attributesService;

    private Attribute attribute;

    @BeforeEach
    void setUp() {
        attribute = new Attribute("attribute1");
    }

    @Test
    void testFindByName() {
        // Setup AttributesRepository returns attribute
        when(attributesRepository.findFirstByName(anyString())).thenReturn(Optional.ofNullable(attribute));

        String name = "attribute1";

        // Testing is result correct
        Attribute fetchedAttribute = attributesService.findByName(name);
        assertEquals(attribute, fetchedAttribute);

        // Attribute by name search testing
        ArgumentCaptor<String> attributeNameArgumentCaptor = ArgumentCaptor.forClass(String.class);
        verify(attributesRepository).findFirstByName(attributeNameArgumentCaptor.capture());
        assertEquals(name, attributeNameArgumentCaptor.getValue());
    }

    @Test
    void testSave() {
        attributesService.save(attribute);

        // Whether is called AttributeRepository.save and is attribute correct
        ArgumentCaptor<Attribute> attributeArgumentCaptor = ArgumentCaptor.forClass(Attribute.class);
        verify(attributesRepository).save(attributeArgumentCaptor.capture());
        assertEquals(attribute, attributeArgumentCaptor.getValue());
    }
}