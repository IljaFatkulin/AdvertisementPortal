package iljafatkulin.advertisement.portal.service;

import iljafatkulin.advertisement.portal.model.Attribute;
import iljafatkulin.advertisement.portal.repositories.AttributesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class AttributesService {
    private final AttributesRepository attributesRepository;

    @Autowired
    public AttributesService(AttributesRepository attributesRepository) {
        this.attributesRepository = attributesRepository;
    }

    public Attribute findByName(String name) {
        return attributesRepository.findFirstByName(name).orElse(null);
    }

    @Transactional
    public void save(Attribute attribute) {
        attributesRepository.save(attribute);
    }
}
