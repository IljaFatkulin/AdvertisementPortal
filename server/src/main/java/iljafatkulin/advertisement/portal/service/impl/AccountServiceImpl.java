package iljafatkulin.advertisement.portal.service.impl;

import iljafatkulin.advertisement.portal.exception.AccountNotFoundException;
import iljafatkulin.advertisement.portal.exception.EmailAlreadyTaken;
import iljafatkulin.advertisement.portal.model.Account;
import iljafatkulin.advertisement.portal.model.Role;
import iljafatkulin.advertisement.portal.repositories.AccountRepository;
import iljafatkulin.advertisement.portal.repositories.RoleRepository;
import iljafatkulin.advertisement.portal.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RequiredArgsConstructor
@Service
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;

    @Override
    public Account createAccount(Account account) {
        if(accountRepository.findByEmail(account.getEmail()) != null) {
            throw new EmailAlreadyTaken();
        }

        account.setPassword(encoder.encode(account.getPassword()));
        Role role = roleRepository.findByName("ROLE_USER");
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        account.setRoles(roles);
        return accountRepository.save(account);
    }

    public Account authenticateUser(String email, String password) {
        Account account = accountRepository.findByEmail(email).orElseThrow(AccountNotFoundException::new);
        if(account == null) {
            throw new UsernameNotFoundException("User not found");
        }
        if(account.getRoles() == null || account.getRoles().isEmpty()) {
            throw new RuntimeException("User has no roles");
        }
        if(account.isLocked()) {
            throw new RuntimeException("Account is locked");
        }
        if(!encoder.matches(password, account.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        return account;
    }

    @Override
    public Account findByEmail(String email) {
        return accountRepository.findByEmail(email).orElseThrow(AccountNotFoundException::new);
    }

    @Override
    public List<Account> getAll() {
        return accountRepository.findAll();
    }
}
