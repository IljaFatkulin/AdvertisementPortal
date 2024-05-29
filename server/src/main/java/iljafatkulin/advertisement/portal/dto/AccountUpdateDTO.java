package iljafatkulin.advertisement.portal.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountUpdateDTO {
    private int id;

    private String role;

    private String banned;
}
