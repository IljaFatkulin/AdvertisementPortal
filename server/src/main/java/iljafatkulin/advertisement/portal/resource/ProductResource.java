package iljafatkulin.advertisement.portal.resource;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import iljafatkulin.advertisement.portal.dto.AttributeValueDTO;
import iljafatkulin.advertisement.portal.dto.ProductDTO;
import iljafatkulin.advertisement.portal.dto.ProductDetailsDTO;
import iljafatkulin.advertisement.portal.dto.EditedImageDTO;
import iljafatkulin.advertisement.portal.model.*;
import iljafatkulin.advertisement.portal.repositories.FavoriteRepository;
import iljafatkulin.advertisement.portal.request.FormCreateProduct;
import iljafatkulin.advertisement.portal.request.FormEditProduct;
import iljafatkulin.advertisement.portal.service.AttributesService;
import iljafatkulin.advertisement.portal.service.CategoriesService;
import iljafatkulin.advertisement.portal.service.ProductsService;
import iljafatkulin.advertisement.portal.util.FormUtil;
import iljafatkulin.advertisement.portal.util.ObjectConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StreamUtils;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.Validator;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Sort;

import java.io.Console;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductResource {
    private final ProductsService productsService;
    private final CategoriesService categoriesService;
    private final AttributesService attributesService;
    private final FavoriteRepository favoriteRepository;

    private final ObjectMapper objectMapper;
    private final Validator validator;

    @GetMapping()
    public List<ProductDTO> index(@RequestParam(name = "category", required = true) String categoryName,
                                  @RequestParam(name = "page", required = false) Integer page,
                                  @RequestParam(name = "limit", required = false) Integer limit,
                                  @RequestParam(name = "attributes", required = false) List<String> attributes,
                                  @RequestParam(name = "values", required = false) List<String> values,
                                  @RequestParam(name = "name", required = false) String name,
                                  @RequestParam(name = "minPrice", required = false) Double minPrice,
                                  @RequestParam(name = "maxPrice", required = false) Double maxPrice,
                                  @RequestParam(name = "sortBy", required = false) String sortBy,
                                  @RequestParam(name = "order", required = false) String order
    ) throws IOException {
        Category category = categoriesService.findByName(categoryName);
        int categoryId = category.getId();

        List<Product> products;

        name = name != null ? name : "";
        minPrice = minPrice != null ? minPrice : 0;
        maxPrice = maxPrice != null ? maxPrice : 0;
        if(!name.isEmpty() || minPrice > 0 || maxPrice > 0) {
            String sort;
            String direction;
            System.out.println(sortBy);
            System.out.println(order);
            if (sortBy != null && !sortBy.isEmpty()) {
                sort = sortBy;
            } else {
                sort = "id";
            }
            if (order != null && !order.isEmpty()) {
                direction = order;
            } else {
                direction = "ASC";
            }
            products = productsService.searchByNameAndPriceAndCategory(name, minPrice, maxPrice, category, direction, sort);
        } else if(attributes != null && values != null) {
            products = productsService.findByAttributesAndValuesAndCategory(attributes, values, category);
        } else if (page != null && limit != null) {
            String sort;
            String order2;
            System.out.println(sortBy);
            System.out.println(order);
            if (sortBy != null && !sortBy.isEmpty()) {
                sort = sortBy;
            } else {
                sort = "id";
            }
            if (order != null && !order.isEmpty()) {
                order2 = order;
            } else {
                order2 = "ASC";
            }
            Sort.Direction direction = Sort.Direction.fromString(order2.toUpperCase());
            Pageable pageable = PageRequest.of(page, limit, Sort.by(direction, sort));
            products = productsService.findByCategoryId(categoryId, pageable);
        } else {
            products = new ArrayList<>();
        }

        List<ProductDTO> productDTOList = ObjectConverter.convertList(products, ProductDTO.class);

        for(int i = 0; i < products.size(); i++) {
            String path = products.get(i).getAvatarPath();
            if(path != null) {
                productDTOList.get(i).setAvatar(getImage(path));
            }
        }

        return productDTOList;
    }

    @GetMapping("/favoriteproducts/{userId}")
    public List<ProductDTO> getFavoriteProducts(@PathVariable("userId") Long userId)
    {
        try {
            List<Favorite> favorites = favoriteRepository.findByAccountId(userId);

            List<Product> products = new ArrayList<>();

            for(Favorite fav : favorites) {
                Product product = productsService.findById(fav.getProductId());
                products.add(product);
            }

            List<ProductDTO> productDTOList = ObjectConverter.convertList(products, ProductDTO.class);

            for(int i = 0; i < products.size(); i++) {
                String path = products.get(i).getAvatarPath();
                if(path != null) {
                    productDTOList.get(i).setAvatar(getImage(path));
                }
            }

            return productDTOList;
        } catch (RuntimeException | IOException e) {
            return new ArrayList<>();
        }
    }

    @GetMapping("/user/{email}")
    public List<ProductDTO> getUserProducts(@PathVariable("email") String email) throws IOException {
        List<Product> products = productsService.findBySellerEmail(email);
        List<ProductDTO> productDTOList = ObjectConverter.convertList(products, ProductDTO.class);

        for(int i = 0; i < products.size(); i++) {
            String path = products.get(i).getAvatarPath();
            if(path != null) {
                productDTOList.get(i).setAvatar(getImage(path));
            }
        }

        return productDTOList;
    }

    @GetMapping("/count")
    public long productsCount(@RequestParam(name = "category", required = true) String name) {
        return productsService.getProductsCountByCategory(name);
    }

    @GetMapping("/{id}")
    public ProductDetailsDTO productInfo(@PathVariable("id") int id) throws IOException {
        Product product = productsService.findById(id);
        String avatarPath = product.getAvatarPath();


        ProductDetailsDTO productDTO = ObjectConverter.convert(product, ProductDetailsDTO.class);
        if(avatarPath != null) {
            productDTO.setAvatar(getImage(avatarPath));
        }
        if(product.getImages() != null) {
            for(ProductImage image : product.getImages()) {
                productDTO.addImageBytes(image.getId(), getImage(image.getPath()));
            }
        }


        return productDTO;
    }

    @PostMapping("/delete")
    public ResponseEntity<HttpStatus> delete(@RequestBody Map<String, Integer> request) {
        productsService.delete(request.get("id"));

        return ResponseEntity.ok(HttpStatus.OK);
    }


    @PostMapping("/edit")
    @PreAuthorize("hasRole('ADMIN') or @productsService.isSellerOfProduct(authentication.name, #id)")
    @ResponseBody
    public ResponseEntity<Object> edit(@RequestParam(value = "avatar", required = false) MultipartFile avatar,
                                       @RequestParam("product") String productString,
                                       @RequestParam("attributes") String attributesString,
                                       @RequestParam("id") int id,
                                       @RequestParam(value = "images", required = false) MultipartFile[] images,
                                       @RequestParam(value = "imagesIds", required = false) Integer[] imagesIds,
                                       @RequestParam(value = "newImages", required = false) MultipartFile[] newImages,
                                       @RequestParam(value = "imagesToDelete", required = false) Integer[] imagesToDeleteIds) throws JsonProcessingException
    {
        // Converting json to DTObjects
        ProductDTO productDTO = objectMapper.readValue(productString, ProductDTO.class);
        List<AttributeValueDTO> attributeValueDTOList = objectMapper.readValue(attributesString, new TypeReference<>() {});
        System.out.println(attributesString);

        // Input validation
        FormEditProduct form = new FormEditProduct();
        form.setId(id);
        form.setProduct(productDTO);
        form.setAttributes(attributeValueDTOList);
        // BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(form, "form");
        // validator.validate(form, bindingResult);

        // Fetching product to edit from db
        Product productToEdit = productsService.findById(id);

        if(productToEdit == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        // if(bindingResult.hasErrors()) {
        //     return FormUtil.generateResponseEntityWithErrorsBadRequest(bindingResult);
        // }

        Product product = ObjectConverter.convert(form.getProduct(), Product.class);

        productsService.clearFromAttributes(productToEdit);
        addAttributesToProduct(attributeValueDTOList, productToEdit);

        productToEdit.setName(product.getName());
        productToEdit.setPrice(product.getPrice());
        productToEdit.setDescription(product.getDescription());
        if(images != null && imagesIds != null) {
            for(int i = 0; i < imagesIds.length; i++) {
            // for (EditedImageDTO image : images) {
                if(images[i] != null) {
                    productsService.editImage(productToEdit, imagesIds[i], images[i]);
                } else {
                    System.out.println("FILE IS NULL");
                }
            // }
            }
        }
        if(newImages != null) {
            for(MultipartFile img : newImages) {
                if(img != null) {
                    productsService.addImage(productToEdit, img);
                } else {
                    System.out.println("FILE IS NULL");
                }
            }
        }

        if(imagesToDeleteIds != null) {
            productsService.edit(productToEdit, avatar, imagesToDeleteIds);
        } else {
            productsService.edit(productToEdit, avatar);
        }

        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PostMapping(value = "/create", consumes = "multipart/form-data")
    @ResponseBody
    public ResponseEntity<Object> create(@RequestParam("avatar") MultipartFile avatar,
                                         @RequestParam("product") String productString,
                                         @RequestParam("attributes") String attributesString,
                                         @RequestParam("categoryName") String categoryName,
                                         @RequestParam(value = "images", required = false) MultipartFile[] images) throws JsonProcessingException
    {
        // Converting json to DTObjects
        ProductDTO productDTO = objectMapper.readValue(productString, ProductDTO.class);
        List<AttributeValueDTO> attributeValueDTOList = objectMapper.readValue(attributesString, new TypeReference<>(){});

        // Input validation
        FormCreateProduct form = new FormCreateProduct();
        form.setProduct(productDTO);
        form.setAttributes(attributeValueDTOList);
        form.setCategoryName(categoryName);
        BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(form, "form");
        validator.validate(form, bindingResult);

        if(bindingResult.hasErrors()) {
            return FormUtil.generateResponseEntityWithErrorsBadRequest(bindingResult);
        }

        Product product = ObjectConverter.convert(productDTO, Product.class);
        Category category = categoriesService.findByName(categoryName);
        product.setCategory(category);

        addAttributesToProduct(attributeValueDTOList, product);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String sellerEmail = authentication.getName();

        if(images != null) {
            System.out.println("IMAGES ARE HERE ");
            for (MultipartFile image : images) {
                if(image != null) {
                    productsService.addImage(product, image);
                } else {
                    System.out.println("FILE IS NULL");
                }
            }
        } else {
            System.out.println("EMPTY");
        }
        productsService.save(product, avatar, sellerEmail);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    private void addAttributesToProduct(List<AttributeValueDTO> attributeValueDTOList, Product productToEdit) {
        if(attributeValueDTOList != null) {
            for (AttributeValueDTO attributeValueDTO : attributeValueDTOList) {
                Attribute attribute = attributesService.findByName(attributeValueDTO.getAttribute().getName());
                if (attribute == null) {
                    attribute = new Attribute(attributeValueDTO.getAttribute().getName());
                    attributesService.save(attribute);
                }

                productToEdit.addAttribute(attribute, attributeValueDTO.getValue());
            }
        }
    }

    private byte[] getImage(String path) throws IOException {
        File file = new File("/server/images/" + path);
        if(file.exists()) {
            InputStream in = new FileInputStream(file);

            Resource resource = new InputStreamResource(in);

            if (resource.exists()) {
                try (InputStream inputStream = resource.getInputStream()) {
                    return StreamUtils.copyToByteArray(inputStream);
                } catch (Exception e) {
                    e.printStackTrace();
                    return null;
                }
            }
        }
        System.out.println("EROROROROROR");
        return null;
    }
}
