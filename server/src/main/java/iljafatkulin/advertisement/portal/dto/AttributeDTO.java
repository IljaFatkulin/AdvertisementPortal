package iljafatkulin.advertisement.portal.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.beans.ConstructorProperties;

@Getter
@Setter
public class AttributeDTO {
    private int id;

    @NotEmpty
    @Size(max = 100)
    private String name;
}
