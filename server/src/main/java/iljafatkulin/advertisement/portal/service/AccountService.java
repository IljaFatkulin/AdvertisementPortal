package iljafatkulin.advertisement.portal.service;

import iljafatkulin.advertisement.portal.model.Account;

import java.util.List;

public interface AccountService {
    Account createAccount(Account account);

    Account authenticateUser(String username, String password);

    Account findByEmail(String email);

    List<Account> getAll();

    void changePassword(String email, String oldPassword, String newPassword);

    void changeEmail(String email, String newEmail, String password);

    // Verify old password and send verification email with code
    void changePasswordAndSendVerificationEmail(String email, String oldPassword);

    // Verify code from email and save new password
    void saveNewPasswordAndVerifyCode(String email, String newPassword, String code);
}
