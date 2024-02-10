package iljafatkulin.advertisement.portal.dao;

import iljafatkulin.advertisement.portal.model.Section;

public interface CategoryDAO {
    public void changeSectionWhereSectionIs(Section oldSection, Section newSection);
}
