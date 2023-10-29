package iljafatkulin.advertisement.portal.service;

import iljafatkulin.advertisement.portal.model.Account;

import java.util.List;

public interface AccountService {
    Account createAccount(Account account);

    Account authenticateUser(String username, String password);

    Account findByEmail(String email);

    List<Account> getAll();
}
