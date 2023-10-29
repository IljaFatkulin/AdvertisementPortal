package iljafatkulin.advertisement.portal.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CategoryWithAttributesDTO extends CategoryDTO {
    private List<AttributeDTO> attributes;
}
