package iljafatkulin.advertisement.portal.controllers;

import iljafatkulin.advertisement.portal.dto.AttributeDTO;
import iljafatkulin.advertisement.portal.dto.CategoryDTO;
import iljafatkulin.advertisement.portal.dto.CategoryWithAttributesDTO;
import iljafatkulin.advertisement.portal.forms.FormAddCategoryAttribute;
import iljafatkulin.advertisement.portal.forms.FormCreateCategory;
import iljafatkulin.advertisement.portal.forms.FormRemoveCategoryAttribute;
import iljafatkulin.advertisement.portal.models.Category;
import iljafatkulin.advertisement.portal.services.CategoriesService;
import iljafatkulin.advertisement.portal.util.ObjectConverter;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {
    private final CategoriesService categoriesService;

    @Autowired
    public CategoryController(CategoriesService categoriesService) {
        this.categoriesService = categoriesService;
    }

    @GetMapping
    public List<CategoryDTO> index()
    {
        return ObjectConverter.convertList(categoriesService.findAll(), CategoryDTO.class);
    }

    @PostMapping("/create")
    public ResponseEntity<HttpStatus> create(
            @Valid @RequestBody FormCreateCategory form, BindingResult bindingResult)
    {
        if (bindingResult.hasErrors()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        categoriesService.save(new Category(form.getName()));

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public CategoryWithAttributesDTO categoryInfo(@PathVariable("id") int id) {
        return ObjectConverter.convert(categoriesService.findById(id), CategoryWithAttributesDTO.class);
    }

    @GetMapping("/{id}/attributes")
    public List<AttributeDTO> categoryAttributes(@PathVariable("id") int id) {
        return ObjectConverter.convertList(categoriesService.getCategoryAttributes(id), AttributeDTO.class);
    }

    @PostMapping("/attribute/remove")
    public ResponseEntity<HttpStatus> removeAttributeFromCategory(@Valid @RequestBody FormRemoveCategoryAttribute form, BindingResult bindingResult)
    {
        if(bindingResult.hasErrors()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        categoriesService.removeAttribute(form.getCategoryId() , form.getAttributeId());

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/attribute/add")
    public ResponseEntity<HttpStatus> addAttributeToCategory(@Valid @RequestBody FormAddCategoryAttribute form, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        categoriesService.addAttribute(form.getCategoryId(), form.getAttributeName());

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
