package iljafatkulin.advertisement.portal.resource;

import iljafatkulin.advertisement.portal.dto.AttributeDTO;
import iljafatkulin.advertisement.portal.dto.CategoryDTO;
import iljafatkulin.advertisement.portal.dto.CategoryWithAttributesDTO;
import iljafatkulin.advertisement.portal.request.FormAddCategoryAttribute;
import iljafatkulin.advertisement.portal.request.FormCreateCategory;
import iljafatkulin.advertisement.portal.request.FormRemoveCategoryAttribute;
import iljafatkulin.advertisement.portal.model.Category;
import iljafatkulin.advertisement.portal.service.CategoriesService;
import iljafatkulin.advertisement.portal.util.ObjectConverter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryResource {
    private final CategoriesService categoriesService;

    @GetMapping
    public List<CategoryDTO> index()
    {
        return ObjectConverter.convertList(categoriesService.findAll(), CategoryDTO.class);
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HttpStatus> removeAttributeFromCategory(@Valid @RequestBody FormRemoveCategoryAttribute form, BindingResult bindingResult)
    {
        if(bindingResult.hasErrors()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        categoriesService.removeAttribute(form.getCategoryId() , form.getAttributeId());

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/attribute/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HttpStatus> addAttributeToCategory(@Valid @RequestBody FormAddCategoryAttribute form, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        categoriesService.addAttribute(form.getCategoryId(), form.getAttributeName());

        return new ResponseEntity<>(HttpStatus.OK);
    }
}
