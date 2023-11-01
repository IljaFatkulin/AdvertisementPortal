package iljafatkulin.advertisement.portal.service;

import iljafatkulin.advertisement.portal.exception.AccountNotFoundException;
import iljafatkulin.advertisement.portal.exception.ProductNotFoundException;
import iljafatkulin.advertisement.portal.model.Account;
import iljafatkulin.advertisement.portal.model.Product;
import iljafatkulin.advertisement.portal.repositories.AccountRepository;
import iljafatkulin.advertisement.portal.repositories.ProductAttributeValuesRepository;
import iljafatkulin.advertisement.portal.repositories.ProductsRepository;
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

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ProductsService {
    private final ProductsRepository productsRepository;
    private final ProductAttributeValuesRepository productAttributeValuesRepository;
    private final AccountRepository accountRepository;

    private final String imageFolderPath = "/Users/iljafatkulin/IdeaProjects/Advertisement-Portal/images";

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

        return product;
    }

    public List<Product> findBySellerEmail(String email) {
        return productsRepository.findBySellerEmail(email);
    }

    @Transactional
    public void save(Product product, MultipartFile image, String sellerEmail) {
        if(image != null) {
            product.setAvatarPath(saveImage(image));
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
            deleteImage(product.getAvatarPath());
            productsRepository.delete(product);
        }
    }

    @Transactional
    public void delete(Product product) {
        if(product != null) {
            deleteImage(product.getAvatarPath());
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
    public void edit(Product product, MultipartFile image) {
        if(image != null) {
            deleteImage(product.getAvatarPath());
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

    private void deleteImage(String path) {
        try {
            Files.deleteIfExists(Paths.get(imageFolderPath + path));
        } catch (IOException e) {
            System.out.println("File delete error: " + e.getMessage());
        }
    }

    private String saveImage(MultipartFile image) {
        try {
            String originalFilename = image.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));

            // Generating unique file name
            String uniqueFileName = System.currentTimeMillis() + UUID.randomUUID().toString();

            String fileName = uniqueFileName + fileExtension;

            File destFile = new File(imageFolderPath + "/ads/avatars/" + fileName);
            image.transferTo(destFile);

            return "/ads/avatars/" + fileName;
        } catch (IOException e) {
            System.out.println("Image was not uploaded");
        }

        return null;
    }
}
