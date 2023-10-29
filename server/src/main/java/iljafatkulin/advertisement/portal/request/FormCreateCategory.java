package iljafatkulin.advertisement.portal.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public class FormCreateCategory {
    @NotEmpty
    @Size(max = 100)
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
