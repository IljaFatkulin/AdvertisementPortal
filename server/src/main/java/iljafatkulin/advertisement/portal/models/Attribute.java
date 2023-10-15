package iljafatkulin.advertisement.portal.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@EqualsAndHashCode(of = {"id", "name"})
@NoArgsConstructor
@Entity
@Table(name = "Attribute")
public class Attribute {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name")
    @NotEmpty
    @Size(max = 100)
    private String name;

    @ManyToMany
    @JoinTable(
            name = "Category_Attribute",
            joinColumns = @JoinColumn(name = "attribute_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
//    @JsonBackReference
    @JsonIgnore
    private List<Category> categories;

    @OneToMany(mappedBy = "attribute")
    @JsonIgnore
    private List<ProductAttributeValue> products;

    public Attribute(String name) {
        this.name = name;
    }

    public void addCategory(Category category) {
        if(this.categories == null) {
            this.categories = new ArrayList<>();
        }

        this.categories.add(category);
    }

    public void removeCategory(Category category) {
        if(this.categories != null) {
            this.categories.remove(category);
        }
    }

    public void addProduct(ProductAttributeValue product) {
        if(this.products == null) {
            this.products = new ArrayList<>();
        }

        this.products.add(product);
    }
}
