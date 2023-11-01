package iljafatkulin.advertisement.portal.resource;

import com.auth0.jwt.exceptions.JWTVerificationException;
import iljafatkulin.advertisement.portal.exception.AccountNotFoundException;
import iljafatkulin.advertisement.portal.exception.EmailAlreadyTaken;
import iljafatkulin.advertisement.portal.model.Account;
import iljafatkulin.advertisement.portal.request.LoginRequest;
import iljafatkulin.advertisement.portal.security.JWTUtil;
import iljafatkulin.advertisement.portal.service.AccountService;
import iljafatkulin.advertisement.portal.util.ResourceUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountResource {
    private final AccountService accountService;
    private final JWTUtil jwtUtil;

    @PostMapping("/create")
    public ResponseEntity<?> createAccount(@RequestBody Account account) {
        try {
            Account newAccount = accountService.createAccount(account);
            String token = jwtUtil.generateToken(newAccount.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("account", account);
            response.put("token", token);

            return ResponseEntity.created(ResourceUtil.getLocation(newAccount.getId())).body(response);
        } catch (EmailAlreadyTaken e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Account account = accountService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());

            String token = jwtUtil.generateToken(account.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("account", account);
            response.put("token", token);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            String errorMessage = e.getMessage();
            HttpStatus status = HttpStatus.UNAUTHORIZED; // 401

            return new ResponseEntity<>(errorMessage, status);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyToken(@RequestBody Map<String, String> requestBody) {
        String token = requestBody.get("token");
        try {
            String email = jwtUtil.validateTokenAndRetrieveClaim(token);

            Account account = accountService.findByEmail(email);

            return ResponseEntity.ok(account);
        } catch (JWTVerificationException e) {
            return new ResponseEntity<>("Invalid JWT token", HttpStatus.UNAUTHORIZED);
        } catch (AccountNotFoundException e) {
            return new ResponseEntity<>("Account not found", HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/change/password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> requestBody) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        String oldPassword = requestBody.get("old_password");
        String newPassword = requestBody.get("new_password");

        try {
            accountService.changePassword(email, oldPassword, newPassword);
        } catch (AccountNotFoundException e) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        } catch (BadCredentialsException e) {
            return new ResponseEntity<>("Invalid password", HttpStatus.UNAUTHORIZED);
        }

        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PostMapping("/change/email")
    public ResponseEntity<?> changeEmail(@RequestBody Map<String, String> requestBody) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String oldEmail = authentication.getName();
        String password = requestBody.get("password");
        String newEmail = requestBody.get("email");

        try {
            accountService.changeEmail(oldEmail, newEmail, password);
        } catch (AccountNotFoundException e) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        } catch (BadCredentialsException e) {
            return new ResponseEntity<>("Invalid password", HttpStatus.UNAUTHORIZED);
        }

        return ResponseEntity.ok(HttpStatus.OK);
    }
}
