package iljafatkulin.advertisement.portal.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class AccountDTO {
    private long id;

    private String email;

    private Set<RoleDTO> roles;
}
