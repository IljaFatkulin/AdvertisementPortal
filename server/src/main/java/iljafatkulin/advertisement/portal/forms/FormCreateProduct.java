package iljafatkulin.advertisement.portal.forms;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FormCreateProduct extends FormProduct{
    @NotEmpty
    private String categoryName;
}
