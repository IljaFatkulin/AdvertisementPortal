package iljafatkulin.advertisement.portal.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FormRemoveCategoryAttribute {
    @NotNull
    private int categoryId;
    @NotNull
    private int attributeId;
}
