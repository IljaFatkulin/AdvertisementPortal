package iljafatkulin.advertisement.portal.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@AllArgsConstructor
public class EditedImageDTO {
    private int id;
    private MultipartFile image;
}
