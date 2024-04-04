package iljafatkulin.advertisement.portal.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.Cascade;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@ToString(of = {"id", "name", "price", "description", "created_at", "updated_at"})
@Getter
@Setter
@EqualsAndHashCode(of = {"id", "name", "price", "description"})
@NoArgsConstructor
@Entity
@Table(name = "Product")
public class Product {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name")
    @NotEmpty(message = "Name is required")
    @Size(max = 100, message = "Name must be shorter than 100 characters")
    private String name;

    @Column(name = "price")
    @Min(value = 0, message = "Price must be more than 0")
    private double price;

    @Column(name = "viewCount")
    @Min(value = 0, message = "Price must be more than 0")
    private int viewCount;

    @Column(name = "description")
    @NotEmpty(message = "Description is required")
    @Size(max = 10000, message = "Description must be shorter than 10,000 characters")
    private String description;

    @Column(name = "created_at")
    private Date createdAt;

    @Column(name = "updated_at")
    private Date updatedAt;

    @Column(name = "avatar_path")
    private String avatarPath;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", referencedColumnName = "id")
    private Category category;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    private List<ProductAttributeValue> attributes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id")
    private Account seller;

    @OneToMany(mappedBy = "product")
    @Cascade(org.hibernate.annotations.CascadeType.ALL)
    private List<ProductImage> images;

    public Product(String name, double price, String description) {
        this.name = name;
        this.price = price;
        this.description = description;
    }

    public void addAttribute(Attribute attribute, String value) {
        ProductAttributeValue productAttributeValue = new ProductAttributeValue();
        productAttributeValue.setAttribute(attribute);
        productAttributeValue.setProduct(this);
        productAttributeValue.setValue(value);

        if(this.attributes == null) {
            this.attributes = new ArrayList<>();
        }

        this.attributes.add(productAttributeValue);
    }

    public void addImage(ProductImage image) {
        if(images == null) {
            images = new ArrayList<>();
        }

        image.setProduct(this);
        images.add(image);
    }

    public ProductImage findImageById(int imageId) {
        if(images != null) {
            for(ProductImage img : images) {
                if(img.getId() == imageId) {
                    return img;
                }
            }
        }

        return null;
    }

    public void removeImage(int imageId) {
        if(images != null) {
            for(ProductImage img : images) {
                if(img.getId() == imageId) {
                    images.remove(img);
                    break;
                }
            }
        }
    }
}
