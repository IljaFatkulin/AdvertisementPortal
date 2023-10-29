package iljafatkulin.advertisement.portal.request;

import iljafatkulin.advertisement.portal.dto.AttributeValueDTO;
import iljafatkulin.advertisement.portal.dto.ProductDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class FormProduct {
    @Valid
    @NotNull
    private ProductDTO product;
    private List<AttributeValueDTO> attributes;
}
