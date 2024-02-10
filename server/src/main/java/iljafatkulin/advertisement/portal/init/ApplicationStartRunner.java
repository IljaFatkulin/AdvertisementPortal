package iljafatkulin.advertisement.portal.init;

import iljafatkulin.advertisement.portal.model.Account;
import iljafatkulin.advertisement.portal.model.Category;
import iljafatkulin.advertisement.portal.model.Role;
import iljafatkulin.advertisement.portal.model.Section;
import iljafatkulin.advertisement.portal.repositories.RoleRepository;
import iljafatkulin.advertisement.portal.repositories.SectionRepository;
import iljafatkulin.advertisement.portal.service.AccountService;
import iljafatkulin.advertisement.portal.service.SectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Component;

import java.util.Collections;

import static java.util.Arrays.asList;

@Component
@RequiredArgsConstructor
public class ApplicationStartRunner implements CommandLineRunner {
    private final RoleRepository roleRepository;
    private final AccountService accountService;
    private final SectionRepository sectionRepository;
    private final SectionService sectionService;

    @Override
    public void run(String... args) throws Exception {
        Role roleUser = new Role(1L, "1", "ROLE_USER");
        Role roleAdmin = new Role(2L, "2", "ROLE_ADMIN");
        roleRepository.saveAll(asList(roleUser, roleAdmin));

        try {
            Section section = new Section();
            section.setName("Other");
            Category category = new Category("Without category");
            section.addCategory(category);
            sectionService.create(section);
        } catch (DuplicateKeyException ignored) {}

        try {
            Account account = new Account(1L, "user@gmail.com", "user", true, false, false, false, Collections.singleton(roleUser));
            accountService.createAccount(account);
        } catch (RuntimeException e) {
            return;
        }
    }
}
