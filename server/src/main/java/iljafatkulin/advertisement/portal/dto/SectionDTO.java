package iljafatkulin.advertisement.portal.dto;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SectionDTO {
    private int id;

    @NotNull
    @Size(max = 100)
    private String name;

    private long productCount;

    private List<CategoryDTO> categories;
}
