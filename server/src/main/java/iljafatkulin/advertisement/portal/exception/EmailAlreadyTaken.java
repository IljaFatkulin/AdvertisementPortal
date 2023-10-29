package iljafatkulin.advertisement.portal.exception;

public class EmailAlreadyTaken extends RuntimeException {
    public EmailAlreadyTaken() {
        super("Email already taken");
    }
}
