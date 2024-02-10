package iljafatkulin.advertisement.portal.dao;

import iljafatkulin.advertisement.portal.model.Section;

import java.util.List;

public interface SectionDAO {
    public List<Section> getAllSectionsWithCategories();
}
