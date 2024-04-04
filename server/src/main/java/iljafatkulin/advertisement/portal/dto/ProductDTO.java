package iljafatkulin.advertisement.portal.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Date;
import java.util.Locale;

@Getter
@Setter
public class ProductDTO {
    private int id;

    @NotEmpty(message = "Name is required")
    @Size(max = 100, message = "Name must be shorter than 100 characters")
    private String name;

    @Min(value = 0, message = "Price must be more than 0")
    private double price;

    @NotEmpty(message = "Description is required")
    @Size(max = 10000, message = "Description must be shorter than 10,000 characters")
    private String description;

    private CategoryDTO category;

    private byte[] avatar;

    private int viewCount;

    private Date createdAt;

    public String getPrice() {
        DecimalFormatSymbols decimalFormatSymbols = new DecimalFormatSymbols(Locale.US); // Используем точку в качестве разделителя
        DecimalFormat decimalFormat = new DecimalFormat("#0.00", decimalFormatSymbols);
        return decimalFormat.format(price);
    }

    @Override
    public String toString() {
        return "ProductDTO{" +
                "name='" + name + '\'' +
                ", price=" + price +
                ", description='" + description + '\'' +
                '}';
    }
}
