package iljafatkulin.advertisement.portal.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id;

    @Column(name = "email")
    @NotNull
    @Size(min = 7, max = 100)
    @Email
    private String email;

    @Column(name = "password")
    @NotNull
    @Size(max = 100)
    private String password;

    @Column(name = "enabled")
    private boolean enabled = true;
    @Column(name = "credentials_expired")
    private boolean credentialsExpired = false;
    @Column(name = "expired")
    private boolean expired = false;
    @Column(name = "locked")
    private boolean locked = false;

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
            name = "Account_Role",
            joinColumns = @JoinColumn(name = "account_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id")
    )

    private Set<Role> roles;

    @Column(name = "verification_code")
    @JsonIgnore
    private String verificationCode;

    public Account(long id, String email, String password, boolean enabled, boolean credentialsExpired, boolean expired, boolean locked, Set<Role> roles) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.enabled = enabled;
        this.credentialsExpired = credentialsExpired;
        this.expired = expired;
        this.locked = locked;
        this.roles = roles;
    }

    @OneToMany(mappedBy = "seller", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Product> products;
}
