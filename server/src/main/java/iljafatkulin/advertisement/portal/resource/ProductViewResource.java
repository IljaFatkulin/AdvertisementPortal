package iljafatkulin.advertisement.portal.resource;

import iljafatkulin.advertisement.portal.repositories.ProductsRepository;
import iljafatkulin.advertisement.portal.repositories.SectionRepository;
import iljafatkulin.advertisement.portal.request.*;
import iljafatkulin.advertisement.portal.model.ProductView;
import iljafatkulin.advertisement.portal.model.Section;
import iljafatkulin.advertisement.portal.dto.ProfileStatsDTO;
import iljafatkulin.advertisement.portal.model.Category;
import iljafatkulin.advertisement.portal.model.Product;
import iljafatkulin.advertisement.portal.repositories.CategoriesRepository;
import iljafatkulin.advertisement.portal.repositories.ProductViewRepository;
import iljafatkulin.advertisement.portal.service.ProductsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/product_view")
@RequiredArgsConstructor
public class ProductViewResource {
    private final ProductViewRepository productViewRepository;
    private final ProductsRepository productsRepository;
    private final ProductsService productsService;
    private final CategoriesRepository categoriesRepository;
    private final SectionRepository sectionRepository;

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

    @GetMapping("/{id}/favorite")
    public Integer favorite(@PathVariable("id") int id)
    {
        Product product = productsService.findById(id);
        return Objects.requireNonNullElse(product.getUserCountSaved(), 0);
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
        productViewRepository.save(new ProductView(null, product, form.isAuthorized(), form.getUserId(), new Date()));
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ProfileStatsDTO getByUser(@PathVariable("userId") long userId) {
        List<Product> products = productsRepository.findBySellerId(userId);

        List<Integer> productIds = new ArrayList<>();
        Integer favoriteCount = 0;
        for (Product product : products) {
            favoriteCount += Objects.requireNonNullElse(product.getUserCountSaved(), 0);
            productIds.add(product.getId());
        }

        ProfileStatsDTO profileStatsDTO = new ProfileStatsDTO();
        profileStatsDTO.setViewCount(productViewRepository.countByProductIdIn(productIds));
        profileStatsDTO.setAuthViewCount(productViewRepository.countByProductIdInAndAuthorized(productIds, true));

        int productsCount = products.size();
        profileStatsDTO.setActiveAds(productsCount);

        profileStatsDTO.setViewCountLastMonth(productViewRepository.countByProductIdInAndCreatedAtAfter(productIds, new Date(System.currentTimeMillis() - 30L * 24 * 60 * 60 * 1000)));
        profileStatsDTO.setAuthViewCountLastMonth(productViewRepository.countByProductIdInAndCreatedAtAfterAndAuthorized(productIds, new Date(System.currentTimeMillis() - 30L * 24 * 60 * 60 * 1000), true));

        profileStatsDTO.setFavoriteCount(favoriteCount);

        return profileStatsDTO;
    }

    @GetMapping("/category/{category}")
    public ProfileStatsDTO getByCategory(@PathVariable("category") String categoryName) {
        Optional<Category> category = categoriesRepository.findFirstByNameIgnoreCase(categoryName);
        if (category.isEmpty()) {
            return new ProfileStatsDTO();
        }
        List<Product> products = productsRepository.findByCategoryId(category.get().getId());

        List<Integer> productIds = new ArrayList<>();
        Integer favoriteCount = 0;

        for (Product product : products) {
            favoriteCount += Objects.requireNonNullElse(product.getUserCountSaved(), 0);
            productIds.add(product.getId());
        }

        ProfileStatsDTO profileStatsDTO = new ProfileStatsDTO();
        profileStatsDTO.setViewCount(productViewRepository.countByProductIdIn(productIds));
        profileStatsDTO.setAuthViewCount(productViewRepository.countByProductIdInAndAuthorized(productIds, true));
        profileStatsDTO.setViewCountLastMonth(productViewRepository.countByProductIdInAndCreatedAtAfter(productIds, new Date(System.currentTimeMillis() - 30L * 24 * 60 * 60 * 1000)));
        profileStatsDTO.setAuthViewCountLastMonth(productViewRepository.countByProductIdInAndCreatedAtAfterAndAuthorized(productIds, new Date(System.currentTimeMillis() - 30L * 24 * 60 * 60 * 1000), true));
        profileStatsDTO.setFavoriteCount(favoriteCount);
        profileStatsDTO.setActiveAds(products.size());

        return profileStatsDTO;
    }

    @GetMapping("/section/{section}")
    public ProfileStatsDTO getBySection(@PathVariable("section") String sectionName) {
        Optional<Section> section = sectionRepository.findByNameIgnoreCase(sectionName);
        if (section.isEmpty()) {
            return new ProfileStatsDTO();
        }
        List<Category> categories = categoriesRepository.findBySectionId(section.get().getId());

        List<Product> products = new ArrayList<>();
        for (Category category : categories) {
            products.addAll(productsRepository.findByCategoryId(category.getId()));
        }

        List<Integer> productIds = new ArrayList<>();
        Integer favoriteCount = 0;

        for (Product product : products) {
            favoriteCount += Objects.requireNonNullElse(product.getUserCountSaved(), 0);
            productIds.add(product.getId());
        }

        ProfileStatsDTO profileStatsDTO = new ProfileStatsDTO();
        profileStatsDTO.setViewCount(productViewRepository.countByProductIdIn(productIds));
        profileStatsDTO.setAuthViewCount(productViewRepository.countByProductIdInAndAuthorized(productIds, true));
        profileStatsDTO.setViewCountLastMonth(productViewRepository.countByProductIdInAndCreatedAtAfter(productIds, new Date(System.currentTimeMillis() - 30L * 24 * 60 * 60 * 1000)));
        profileStatsDTO.setAuthViewCountLastMonth(productViewRepository.countByProductIdInAndCreatedAtAfterAndAuthorized(productIds, new Date(System.currentTimeMillis() - 30L * 24 * 60 * 60 * 1000), true));
        profileStatsDTO.setFavoriteCount(favoriteCount);
        profileStatsDTO.setActiveAds(products.size());

        return profileStatsDTO;
    }

}
