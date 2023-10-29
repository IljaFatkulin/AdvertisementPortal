package iljafatkulin.advertisement.portal.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FormAddCategoryAttribute {
    @NotNull
    private int categoryId;
    @NotEmpty
    private String attributeName;
}
