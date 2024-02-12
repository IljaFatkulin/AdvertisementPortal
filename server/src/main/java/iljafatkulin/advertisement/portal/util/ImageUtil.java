package iljafatkulin.advertisement.portal.util;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

public class ImageUtil {
    private final static String imageFolderPath = "/server/images";

    public static String saveImage(MultipartFile image, String path) {
        try {
            String originalFilename = image.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));

            // Generating unique file name
            String uniqueFileName = System.currentTimeMillis() + UUID.randomUUID().toString();

            String fileName = uniqueFileName + fileExtension;

            File destFile = new File(imageFolderPath + path + fileName);
            image.transferTo(destFile);

            return path + fileName;
        } catch (IOException e) {
            System.out.println("Image was not uploaded, Error: " + e.getMessage());
        }

        return null;
    }

    public static void deleteImage(String path) {
        try {
            Files.deleteIfExists(Paths.get(imageFolderPath + path));
        } catch (IOException e) {
            System.out.println("File delete error: " + e.getMessage());
        }
    }
}
