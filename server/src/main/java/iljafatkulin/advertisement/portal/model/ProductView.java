package iljafatkulin.advertisement.portal.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

import org.hibernate.annotations.Cascade;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class ProductView {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    @Cascade(org.hibernate.annotations.CascadeType.PERSIST)
    private Product product;

    @Column(name = "authorized")
    private boolean authorized;

    @Column(name = "user_id")
    private String userId;

    @Column(name = "created_at")
    private Date createdAt = new Date();
}
