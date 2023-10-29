package iljafatkulin.advertisement.portal.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;
import org.hibernate.annotations.Cascade;

@Getter
@Setter
@EqualsAndHashCode(of = {"id", "value"})
@NoArgsConstructor
@ToString
@Entity
@Table(name = "Product_Attribute_Value")
public class ProductAttributeValue {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    @Cascade(org.hibernate.annotations.CascadeType.PERSIST)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "attribute_id", referencedColumnName = "id")
    @Cascade(org.hibernate.annotations.CascadeType.PERSIST)
    private Attribute attribute;

    @Column(name = "value1")
    @NotEmpty
    private String value;

    public ProductAttributeValue(String value) {
        this.value = value;
    }
}
