package iljafatkulin.advertisement.portal.dto;

import java.util.List;

public class ProductWithAttributesDTO extends ProductDTO {
    private List<AttributeValueDTO> attributes;

    public List<AttributeValueDTO> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<AttributeValueDTO> attributes) {
        this.attributes = attributes;
    }
}
