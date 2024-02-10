package iljafatkulin.advertisement.portal.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.Fetch;

import java.util.ArrayList;
import java.util.List;

@ToString
@Getter
@Setter
@EqualsAndHashCode(of = {"id", "name"})
@NoArgsConstructor
@Entity
@Table(name = "category")
public class Category {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "name")
    @NotEmpty
    @Size(max = 100)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "section_id", referencedColumnName = "id")
    @JsonIgnore
    private Section section;

    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Product> products;

    @ManyToMany(mappedBy = "categories", fetch = FetchType.LAZY)
//    @JsonManagedReference
    @JsonIgnore
    private List<Attribute> attributes;

    public Category(String name) {
        this.name = name;
    }

    public void addAttribute(Attribute attribute) {
        if(this.attributes == null) {
            this.attributes = new ArrayList<>();
        }
        this.attributes.add(attribute);
//        attribute.getCategories().add(this);
        attribute.addCategory(this);
    }

    public void removeAttribute(Attribute attribute) {
        if(this.attributes != null) {
            this.attributes.remove(attribute);
        }
//        attribute.getCategories().remove(this);
        attribute.removeCategory(this);
    }
}
