package iljafatkulin.advertisement.portal.resource;

import iljafatkulin.advertisement.portal.exception.EmailAlreadyTaken;
import iljafatkulin.advertisement.portal.model.Account;
import iljafatkulin.advertisement.portal.request.LoginRequest;
import iljafatkulin.advertisement.portal.service.AccountService;
import iljafatkulin.advertisement.portal.util.ResourceUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountResource {
    private final AccountService accountService;

    @PostMapping("/create")
    public ResponseEntity<?> createAccount(@RequestBody Account account) {
        try {
            Account newAccount = accountService.createAccount(account);
            return ResponseEntity.created(ResourceUtil.getLocation(newAccount.getId())).body(newAccount);
        } catch (EmailAlreadyTaken e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Account account = accountService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());
            return ResponseEntity.ok(account);
        } catch (RuntimeException e) {
            String errorMessage = e.getMessage();
            HttpStatus status = HttpStatus.UNAUTHORIZED; // 401

            return new ResponseEntity<>(errorMessage, status);
        }
    }
}
