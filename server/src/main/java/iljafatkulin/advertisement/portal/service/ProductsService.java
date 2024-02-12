package iljafatkulin.advertisement.portal.service;

import iljafatkulin.advertisement.portal.exception.AccountNotFoundException;
import iljafatkulin.advertisement.portal.exception.ProductNotFoundException;
import iljafatkulin.advertisement.portal.model.Account;
import iljafatkulin.advertisement.portal.model.Category;
import iljafatkulin.advertisement.portal.model.Product;
import iljafatkulin.advertisement.portal.model.ProductImage;
import iljafatkulin.advertisement.portal.repositories.AccountRepository;
import iljafatkulin.advertisement.portal.repositories.ProductAttributeValuesRepository;
import iljafatkulin.advertisement.portal.repositories.ProductsRepository;
import iljafatkulin.advertisement.portal.repositories.ProductImageRepository;
import iljafatkulin.advertisement.portal.util.ImageUtil;
import lombok.RequiredArgsConstructor;
import org.hibernate.Hibernate;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ProductsService {
    private final ProductsRepository productsRepository;
    private final ProductAttributeValuesRepository productAttributeValuesRepository;
    private final AccountRepository accountRepository;
    private final ProductImageRepository productImageRepository;

    public List<Product> findAll() {
        return productsRepository.findAll();
    }
  
    public long getProductsCountByCategory(String categoryName) {
        return productsRepository.countByCategoryName(categoryName);
    }

    public List<Product> findByCategoryId(int categoryId) {
        return productsRepository.findByCategoryIdOrderById(categoryId);
    }

    public List<Product> findByCategoryId(int categoryId, PageRequest pageRequest) {
        return productsRepository.findByCategoryIdOrderById(categoryId, pageRequest).getContent();
    }

    public Product findById(int id) {
        Product product = productsRepository.findById(id).orElseThrow(ProductNotFoundException::new);

        Hibernate.initialize(product.getAttributes());
        Hibernate.initialize(product.getSeller());
        Hibernate.initialize(product.getImages());

        return product;
    }

    public List<Product> findBySellerEmail(String email) {
        return productsRepository.findBySellerEmail(email);
    }

    public List<Product> findByAttributesAndValuesAndCategory(List<String> attributes, List<String> values, Category category) {
        List<String> attributeNamesLowercase = attributes.stream()
                .map(String::toLowerCase)
                .collect(Collectors.toList());

        long sizeOfAttributeNames = attributeNamesLowercase.size();

        return productAttributeValuesRepository.findProductsByAttributesAndValues(attributeNamesLowercase, values, sizeOfAttributeNames, category);
    }

    @Transactional
    public void save(Product product, MultipartFile image, String sellerEmail) {
        if(image != null) {
            product.setAvatarPath(saveAvatar(image));
        }

        Account account = accountRepository.findByEmail(sellerEmail).orElseThrow(AccountNotFoundException::new);
        product.setSeller(account);

        product.setCreatedAt(new Date());
        product.setUpdatedAt(new Date());

        productsRepository.save(product);
    }

    @Transactional
    public void delete(int id) {
        Product product = productsRepository.findById(id).orElse(null);
        if(product != null) {
            ImageUtil.deleteImage(product.getAvatarPath());

            List<ProductImage> images = product.getImages();
            for(ProductImage image : images) {
                System.out.println(image.getPath());
                ImageUtil.deleteImage(image.getPath());
            }

            productsRepository.delete(product);
        }
    }

    @Transactional
    public void delete(Product product) {
        if(product != null) {
            ImageUtil.deleteImage(product.getAvatarPath());

            List<ProductImage> images = product.getImages();
            for(ProductImage image : images) {
                System.out.println(image.getPath());
                ImageUtil.deleteImage(image.getPath());
            }

            productsRepository.delete(product);
        }
    }

    public boolean isSellerOfProduct(String email, int productId) {
        Product product = productsRepository.findById(productId).orElse(null);
        if(product != null) {
            Account account = product.getSeller();
            return account.getEmail().equals(email);
        }
        return false;
    }

    @Transactional
    public void edit(Product product) {
        product.setUpdatedAt(new Date());
        if(product.getCreatedAt() == null) {
            product.setCreatedAt(new Date());
        }

        productsRepository.save(product);
    }

    @Transactional
    public void edit(Product product, MultipartFile avatar) {
        if(avatar != null) {
            System.out.println("NOT NULL");
            ImageUtil.deleteImage(product.getAvatarPath());
            product.setAvatarPath(saveAvatar(avatar));
        }

        edit(product);
    }

    @Transactional
    public void clearFromAttributes(Product product) {
        productAttributeValuesRepository.deleteAll(product.getAttributes());
        product.getAttributes().clear();
        productsRepository.save(product);
    }

    @Transactional
    public void addImage(Product product, MultipartFile image) {
        ProductImage productImage = new ProductImage();
        productImage.setPath(saveProductImage(image));
        product.addImage(productImage);
    }

    @Transactional
    public void editImage(Product product, int imageId, MultipartFile image) {
        List<ProductImage> productImages = product.getImages();

        ProductImage productImageToEdit = null;

        for(ProductImage img : productImages) {
            if(img.getId() == imageId) {
                productImageToEdit = img;
                ImageUtil.deleteImage(img.getPath());
                productImageToEdit.setPath(saveProductImage(image));
            }
        }
    }

    @Transactional
    public Product removeImages(Product product) {
        List<ProductImage> images = product.getImages();
        product.setImages(null);
        productImageRepository.deleteAll(images);
        return productsRepository.save(product);
    }


    private String saveAvatar(MultipartFile image) {
        return ImageUtil.saveImage(image, "/ads/avatars/");
    }

    private String saveProductImage(MultipartFile image) {
        return ImageUtil.saveImage(image, "/ads/images/");
    }

    public List<Product> searchByNameAndPriceAndCategory(String name, Double minPrice, Double maxPrice, Category category) {
        return productsRepository.findByStartingNameAndPriceRangeIgnoreCase(name.toLowerCase(), minPrice, maxPrice, category);
    }
}
