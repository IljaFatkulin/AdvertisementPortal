    package iljafatkulin.advertisement.portal.model;

    import jakarta.persistence.*;
    import jakarta.validation.constraints.NotNull;
    import lombok.EqualsAndHashCode;
    import lombok.Getter;
    import lombok.NoArgsConstructor;
    import lombok.Setter;
    import org.hibernate.annotations.Cascade;

    @Getter
    @Setter
    @EqualsAndHashCode(of = {"id", "path"})
    @NoArgsConstructor
    @Entity
    @Table(name = "product_image")
    public class ProductImage {
        @Id
        @Column
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int id;

        @Column(name = "path")
        @NotNull
        private String path;

        @ManyToOne
        @JoinColumn(name = "product_id", referencedColumnName = "id")
        @Cascade(org.hibernate.annotations.CascadeType.PERSIST)
        private Product product;
    }
