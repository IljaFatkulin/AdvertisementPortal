package iljafatkulin.advertisement.portal.service;

import iljafatkulin.advertisement.portal.model.Category;
import iljafatkulin.advertisement.portal.model.Section;

import java.util.List;
import java.util.Optional;

public interface SectionService {
    public Section findById(int id);
    public List<Section> getAllWithCategories();

    public Section create(Section section);

    public void delete(int id);

    public Section rename(int id, String name);

    public void addCategory(int sectionId, String categoryName);
}
