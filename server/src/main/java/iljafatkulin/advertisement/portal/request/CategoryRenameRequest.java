package iljafatkulin.advertisement.portal.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRenameRequest {
    @NotNull
    private int id;

    @NotEmpty
    @Size(max = 100)
    private String name;
}
