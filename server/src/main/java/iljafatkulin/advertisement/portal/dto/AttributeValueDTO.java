package iljafatkulin.advertisement.portal.dto;

public class AttributeValueDTO {
    private AttributeDTO attribute;

    private String value;

    public AttributeDTO getAttribute() {
        return attribute;
    }

    public void setAttribute(AttributeDTO attribute) {
        this.attribute = attribute;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
