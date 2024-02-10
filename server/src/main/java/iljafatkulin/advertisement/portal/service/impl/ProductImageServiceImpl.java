package iljafatkulin.advertisement.portal.service.impl;

import iljafatkulin.advertisement.portal.repositories.ProductImageRepository;
import iljafatkulin.advertisement.portal.service.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ProductImageServiceImpl implements ProductImageService {
    private final ProductImageRepository productImageRepository;

//    public void editImages(int[] ids, MultipartFile[] images) {
//
//        for(MultipartFile image : images) {
//
//        }
//
//        productImageRepository.updatePathsByIds(ids, images);
//    }

    @Override
    public void editImage(int id, MultipartFile image) {

    }
}
