package iljafatkulin.advertisement.portal.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public class ProductDetailsDTO extends ProductDTO {
    private List<AttributeValueDTO> attributes;

    private AccountDTO seller;

    private List<ImageDTO> imagesBytes;

    public ProductDetailsDTO() {
        this.imagesBytes = new ArrayList<>();
    }

    public void addImageBytes(int id, byte[] image) {
        imagesBytes.add(new ImageDTO(id, image));
    }
}
