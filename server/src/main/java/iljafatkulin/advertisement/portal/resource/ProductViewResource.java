package iljafatkulin.advertisement.portal.resource;

import iljafatkulin.advertisement.portal.repositories.ProductsRepository;
import iljafatkulin.advertisement.portal.request.*;
import iljafatkulin.advertisement.portal.model.ProductView;
import iljafatkulin.advertisement.portal.model.Product;
import iljafatkulin.advertisement.portal.repositories.ProductViewRepository;
import iljafatkulin.advertisement.portal.service.ProductsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/product_view")
@RequiredArgsConstructor
public class ProductViewResource {
    private final ProductViewRepository productViewRepository;
    private final ProductsRepository productsRepository;
    private final ProductsService productsService;

    @GetMapping("/{id}")
    public Long index(@PathVariable("id") long id)
    {
        return productViewRepository.countByProductId(id);
    }

    @GetMapping("/{id}/{authorized}")
    public Long index(@PathVariable("id") long id, @PathVariable("authorized") boolean authorized)
    {
        return productViewRepository.countByProductIdAndAuthorized(id, authorized);
    }

    @PostMapping("/create")
    public ResponseEntity<HttpStatus> create(
            @RequestBody CreateProductView form)
    {
        if (productViewRepository.existsByUserIdAndProductId(form.getUserId(), form.getProductId())) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        Product product = productsService.findById(form.getProductId());
        product.setViewCount(product.getViewCount() + 1);
        productsRepository.save(product);
        productViewRepository.save(new ProductView(null, product, form.isAuthorized(), form.getUserId()));
        return new ResponseEntity<>(HttpStatus.CREATED);
    }
}
