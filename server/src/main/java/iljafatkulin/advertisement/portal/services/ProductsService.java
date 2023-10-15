package iljafatkulin.advertisement.portal.services;

import iljafatkulin.advertisement.portal.exceptions.ProductNotFoundException;
import iljafatkulin.advertisement.portal.models.Product;
import iljafatkulin.advertisement.portal.repositories.ProductAttributeValuesRepository;
import iljafatkulin.advertisement.portal.repositories.ProductsRepository;
import jakarta.persistence.EntityManager;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class ProductsService {
    private final ProductsRepository productsRepository;
    private final EntityManager em;
    private final ProductAttributeValuesRepository productAttributeValuesRepository;

    @Autowired
    public ProductsService(ProductsRepository productsRepository, EntityManager em, ProductAttributeValuesRepository productAttributeValuesRepository) {
        this.productsRepository = productsRepository;
        this.em = em;
        this.productAttributeValuesRepository = productAttributeValuesRepository;
    }

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

        return product;
    }

    @Transactional
    public void save(Product product, MultipartFile image) {
        if(image != null) {
            product.setAvatarPath(saveImage(image));
        }

        product.setCreatedAt(new Date());
        product.setUpdatedAt(new Date());

        productsRepository.save(product);
    }

    @Transactional
    public void delete(int id) {
        productsRepository.deleteById(id);
    }

    @Transactional
    public void delete(Product product) {
        productsRepository.delete(product);
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
    public void edit(Product product, MultipartFile image) {
        if(image != null) {
            product.setAvatarPath(saveImage(image));
        }
        product.setUpdatedAt(new Date());
        if(product.getCreatedAt() == null) {
            product.setCreatedAt(new Date());
        }

        productsRepository.save(product);
    }

    @Transactional
    public void clearFromAttributes(Product product) {
        productAttributeValuesRepository.deleteAll(product.getAttributes());
        product.getAttributes().clear();
        productsRepository.save(product);
    }

    private String saveImage(MultipartFile image) {
        try {
            String uploadPath = "/Users/iljafatkulin/IdeaProjects/Advertisement-Portal/images/ads/avatars/";
            String originalFilename = image.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));

            // Generating unique file name
            String uniqueFileName = System.currentTimeMillis() + UUID.randomUUID().toString();

            String fileName = uniqueFileName + fileExtension;

            File destFile = new File(uploadPath + fileName);
            image.transferTo(destFile);

            return "/ads/avatars/" + fileName;
        } catch (IOException e) {
            System.out.println("Image was not uploaded");
        }

        return null;
    }
}
