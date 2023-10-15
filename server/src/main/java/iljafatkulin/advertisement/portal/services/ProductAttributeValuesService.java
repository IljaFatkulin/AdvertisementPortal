package iljafatkulin.advertisement.portal.services;

import iljafatkulin.advertisement.portal.models.ProductAttributeValue;
import iljafatkulin.advertisement.portal.repositories.ProductAttributeValuesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ProductAttributeValuesService {
    private final ProductAttributeValuesRepository productAttributeValuesRepository;

    @Autowired
    public ProductAttributeValuesService(ProductAttributeValuesRepository productAttributeValuesRepository) {
        this.productAttributeValuesRepository = productAttributeValuesRepository;
    }

    @Transactional
    public void deleteAll(List<ProductAttributeValue> list) {
        productAttributeValuesRepository.deleteAll(list);
    }
}
