package iljafatkulin.advertisement.portal.request;

import iljafatkulin.advertisement.portal.dto.CategoryDTO;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SectionAddCategoryRequest {
    @NotNull
    private int sectionId;

    @NotNull
    @Size(max = 100)
    private String categoryName;
}
