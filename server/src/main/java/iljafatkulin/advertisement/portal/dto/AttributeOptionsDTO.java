package iljafatkulin.advertisement.portal.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.ArrayList;


import java.beans.ConstructorProperties;

@Getter
@Setter
public class AttributeOptionsDTO extends AttributeDTO {
    private List<String> options = new ArrayList<>(); 
}