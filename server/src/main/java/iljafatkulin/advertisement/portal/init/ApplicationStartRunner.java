package iljafatkulin.advertisement.portal.init;

import iljafatkulin.advertisement.portal.model.Account;
import iljafatkulin.advertisement.portal.model.Role;
import iljafatkulin.advertisement.portal.repositories.RoleRepository;
import iljafatkulin.advertisement.portal.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Collections;

import static java.util.Arrays.asList;

@Component
@RequiredArgsConstructor
public class ApplicationStartRunner implements CommandLineRunner {
    private final RoleRepository roleRepository;
    private final AccountService accountService;

    @Override
    public void run(String... args) throws Exception {
        Role roleUser = new Role(1L, "1", "ROLE_USER");
        Role roleAdmin = new Role(2L, "2", "ROLE_ADMIN");
        roleRepository.saveAll(asList(roleUser, roleAdmin));

        try {
            Account account = new Account(1L, "user@gmail.com", "user", true, false, false, false, Collections.singleton(roleUser));
            accountService.createAccount(account);
        } catch (RuntimeException e) {
            return;
        }
    }
}
