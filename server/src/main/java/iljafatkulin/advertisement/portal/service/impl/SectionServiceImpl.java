package iljafatkulin.advertisement.portal.service.impl;

import iljafatkulin.advertisement.portal.dao.CategoryDAO;
import iljafatkulin.advertisement.portal.dao.SectionDAO;
import iljafatkulin.advertisement.portal.exception.SectionNotFoundException;
import iljafatkulin.advertisement.portal.model.Category;
import iljafatkulin.advertisement.portal.model.Section;
import iljafatkulin.advertisement.portal.repositories.CategoriesRepository;
import iljafatkulin.advertisement.portal.repositories.SectionRepository;
import iljafatkulin.advertisement.portal.service.SectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class SectionServiceImpl implements SectionService {
    private final SectionRepository sectionRepository;
    private final SectionDAO sectionDAO;
    private final CategoriesRepository categoriesRepository;
    private final CategoryDAO categoryDAO;

    @Override
    public Section findById(int id) {
        return sectionRepository.findById(id).orElseThrow(SectionNotFoundException::new);
    }

    @Override
    public List<Section> getAllWithCategories() {
        return sectionDAO.getAllSectionsWithCategories();
    }

    @Transactional
    @Override
    public Section create(Section section) {
        if(sectionRepository.findByNameIgnoreCase(section.getName().toLowerCase()).isPresent()) {
            throw new DuplicateKeyException("Section already exists");
        }
        return sectionRepository.save(section);
    }

    @Transactional
    @Override
    public void delete(int id) {
        Section oldSection = sectionRepository.findById(id).orElseThrow(SectionNotFoundException::new);
        Section other = sectionRepository.findByName("Other").orElseThrow(RuntimeException::new);

        categoryDAO.changeSectionWhereSectionIs(oldSection, other);
        sectionRepository.delete(oldSection);
    }

    @Transactional
    @Override
    public Section rename(int id, String name) {
        Section section = sectionRepository.findById(id).orElseThrow(SectionNotFoundException::new);
        if(sectionRepository.findByNameIgnoreCase(name).isPresent()) {
            throw new DuplicateKeyException("Section already exists");
        }

        section.setName(name);
        return section;
    }


    @Transactional
    @Override
    public void addCategory(int sectionId, String categoryName) {
        Section section = sectionRepository.findById(sectionId).orElseThrow(SecurityException::new);

        if(categoriesRepository.findFirstByNameIgnoreCase(categoryName.toLowerCase()).isPresent()) {
            throw new DuplicateKeyException("Category already exists");
        }

        Category category = new Category(categoryName);

        section.addCategory(category);
        sectionRepository.save(section);
    }
}
