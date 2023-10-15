package iljafatkulin.advertisement.portal.dto;

import java.util.List;

public class CategoryWithAttributesDTO extends CategoryDTO {
    private List<AttributeDTO> attributes;

    public List<AttributeDTO> getAttributes() {
        return attributes;
    }

    public void setAttributes(List<AttributeDTO> attributes) {
        this.attributes = attributes;
    }
}
