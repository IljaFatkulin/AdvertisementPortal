package iljafatkulin.advertisement.portal.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeleteCategoryRequest {
    @NotNull
    private int id;
}
