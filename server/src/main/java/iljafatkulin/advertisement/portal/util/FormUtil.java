package iljafatkulin.advertisement.portal.util;

import iljafatkulin.advertisement.portal.dto.AttributeValueDTO;
import iljafatkulin.advertisement.portal.forms.FormEditProduct;
import iljafatkulin.advertisement.portal.models.Attribute;
import iljafatkulin.advertisement.portal.models.Product;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

public class FormUtil {

    public static ResponseEntity<Object> generateResponseEntityWithErrorsBadRequest(BindingResult bindingResult) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("error", "Bad Request");

        Map<String, String> errors = new HashMap<>();
        for (FieldError error : bindingResult.getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        response.put("errors", errors);

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}


//    @PostMapping("/edit")
//    @ResponseBody
//    public ResponseEntity<HttpStatus> edit(@Valid @RequestBody FormEditProduct form, BindingResult bindingResult) {
//        Product productToEdit = productsService.findById(form.getId());
//
//        if(bindingResult.hasErrors() || productToEdit == null) {
//            return ResponseEntity.ok(HttpStatus.BAD_REQUEST);
//        }
//
//        Product product = ObjectConverter.convert(form.getProduct(), Product.class);
//
//        productsService.clearFromAttributes(productToEdit);
//
//        if(form.getAttributes() != null) {
//            for (AttributeValueDTO attributeValueDTO : form.getAttributes()) {
//                Attribute attribute = attributesService.findByName(attributeValueDTO.getAttribute().getName());
//                if (attribute == null) attribute = new Attribute(attributeValueDTO.getAttribute().getName());
//
//                productToEdit.addAttribute(attribute, attributeValueDTO.getValue());
//            }
//        }
//
//        productToEdit.setName(product.getName());
//        productToEdit.setPrice(product.getPrice());
//        productToEdit.setDescription(product.getDescription());
//
//        productsService.edit(productToEdit);
//
//        return ResponseEntity.ok(HttpStatus.OK);
//    }