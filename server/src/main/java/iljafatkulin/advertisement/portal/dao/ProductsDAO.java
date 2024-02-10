package iljafatkulin.advertisement.portal.dao;

import iljafatkulin.advertisement.portal.model.Category;

public interface ProductsDAO {
    public void changeCategoryWhereCategoryIs(Category oldCategory, Category newCategory);
}
