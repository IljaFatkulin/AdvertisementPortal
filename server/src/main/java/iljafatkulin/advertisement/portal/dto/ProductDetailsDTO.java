package iljafatkulin.advertisement.portal.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProductDetailsDTO extends ProductDTO {
    private List<AttributeValueDTO> attributes;

    private AccountDTO seller;
}
