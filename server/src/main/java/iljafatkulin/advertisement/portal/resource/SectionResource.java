package iljafatkulin.advertisement.portal.resource;

import iljafatkulin.advertisement.portal.dto.CategoryDTO;
import iljafatkulin.advertisement.portal.dto.SectionDTO;
import iljafatkulin.advertisement.portal.exception.SectionNotFoundException;
import iljafatkulin.advertisement.portal.model.Category;
import iljafatkulin.advertisement.portal.model.Section;
import iljafatkulin.advertisement.portal.repositories.ProductsRepository;
import iljafatkulin.advertisement.portal.request.SectionAddCategoryRequest;
import iljafatkulin.advertisement.portal.request.SectionDeleteRequest;
import iljafatkulin.advertisement.portal.request.SectionRenameRequest;
import iljafatkulin.advertisement.portal.service.SectionService;
import iljafatkulin.advertisement.portal.util.ResourceUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/sections")
public class SectionResource {

    private final SectionService sectionService;
    private final ProductsRepository productsRepository;

    @GetMapping
    public List<SectionDTO> index() {
        List<Section> sections = sectionService.getAllWithCategories();
        List<SectionDTO> sectionDTOS = new ArrayList<>();
        for (Section section : sections) {
            SectionDTO sectionDTO = new SectionDTO(section.getId(), section.getName(), 0, null);
            for (Category category : section.getCategories()) {
                long productCount = productsRepository.countByCategoryName(category.getName());
                sectionDTO.setProductCount(sectionDTO.getProductCount() + productCount);
                CategoryDTO categoryDTO = new CategoryDTO(category.getId(), category.getName(), productCount);

                if(sectionDTO.getCategories() == null) {
                    sectionDTO.setCategories(new ArrayList<>());
                }
                sectionDTO.getCategories().add(categoryDTO);
            }
            sectionDTOS.add(sectionDTO);
        }
        return sectionDTOS;
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> findById(@PathVariable("id") int id) {
        try {
            Section section = sectionService.findById(id);
            return ResponseEntity.ok(section);
        } catch (SectionNotFoundException e) {
            return new ResponseEntity<>("Section not found", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> create(@RequestBody @Valid Section section, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            List<String> errors = new ArrayList<>();
            for(FieldError fieldError : bindingResult.getFieldErrors()) {
                errors.add(fieldError.getDefaultMessage());
            }
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        try {
            Section newSection = sectionService.create(section);
            return ResponseEntity.created(ResourceUtil.getLocation((long) newSection.getId())).body(newSection);
        } catch (DuplicateKeyException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> delete(@RequestBody @Valid SectionDeleteRequest request) {
        try {
            sectionService.delete(request.getId());
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (SectionNotFoundException e) {
            return new ResponseEntity<>("Section not found", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/add/category")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addCategory(@RequestBody @Valid SectionAddCategoryRequest request, BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            List<String> errors = new ArrayList<>();
            for(FieldError fieldError : bindingResult.getFieldErrors()) {
                errors.add(fieldError.getDefaultMessage());
            }
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        try {
            sectionService.addCategory(request.getSectionId(), request.getCategoryName());
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (DuplicateKeyException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (SectionNotFoundException e) {
            return new ResponseEntity<>("Section not found", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/rename")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> rename(@RequestBody @Valid SectionRenameRequest request) {
        try {
            Section section = sectionService.rename(request.getId(), request.getName());
            return ResponseEntity.ok(section);
        } catch (DuplicateKeyException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
