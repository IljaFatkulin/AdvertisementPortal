package iljafatkulin.advertisement.portal.service;

import org.springframework.web.multipart.MultipartFile;

public interface ProductImageService {
    void editImage(int id, MultipartFile image);
}
