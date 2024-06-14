package iljafatkulin.advertisement.portal.resource;

import com.auth0.jwt.exceptions.JWTVerificationException;

import iljafatkulin.advertisement.portal.dto.AccountUpdateDTO;
import iljafatkulin.advertisement.portal.exception.AccountNotFoundException;
import iljafatkulin.advertisement.portal.exception.EmailAlreadyTaken;
import iljafatkulin.advertisement.portal.model.Account;
import iljafatkulin.advertisement.portal.model.Favorite;
import iljafatkulin.advertisement.portal.model.Product;
import iljafatkulin.advertisement.portal.model.Role;
import iljafatkulin.advertisement.portal.repositories.AccountRepository;
import iljafatkulin.advertisement.portal.repositories.FavoriteRepository;
import iljafatkulin.advertisement.portal.repositories.ProductsRepository;
import iljafatkulin.advertisement.portal.repositories.RoleRepository;
import iljafatkulin.advertisement.portal.request.LoginRequest;
import iljafatkulin.advertisement.portal.request.SaveFavoriteRequest;
import iljafatkulin.advertisement.portal.security.JWTUtil;
import iljafatkulin.advertisement.portal.service.AccountService;
import iljafatkulin.advertisement.portal.service.EmailService;
import iljafatkulin.advertisement.portal.service.ProductsService;
import iljafatkulin.advertisement.portal.util.ResourceUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountResource {
    private final AccountService accountService;
    private final EmailService emailService;
    private final AccountRepository accountRepository;
    private final FavoriteRepository favoriteRepository;
    private final ProductsService productsService;
    private final ProductsRepository productsRepository;
    private final RoleRepository roleRepository;

    private final JWTUtil jwtUtil;

    @PostMapping("/create")
    public ResponseEntity<?> createAccount(@RequestBody Account account) {
        try {
            Account newAccount = accountService.createAccount(account);
            String token = jwtUtil.generateToken(newAccount.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("account", account);
            response.put("token", token);

            emailService.sendWelcomeMessage(account.getEmail());
            return ResponseEntity.created(ResourceUtil.getLocation(newAccount.getId())).body(response);
        } catch (EmailAlreadyTaken e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    @PostMapping("/update")
    public ResponseEntity<?> updateAccount(@RequestBody AccountUpdateDTO accountUpdateDTO) {
        Optional<Account> accountOptional = accountRepository.findById((long) accountUpdateDTO.getId());

        if (accountOptional.isEmpty()) {
            return new ResponseEntity<>("Account not found", HttpStatus.NOT_FOUND);
        }

        System.out.println(accountUpdateDTO.getRole());
        System.out.println(accountUpdateDTO.getBanned());
        Account account = accountOptional.get();
        if (accountUpdateDTO.getRole() != null) {
            Role role = roleRepository.findByName("ROLE_" + accountUpdateDTO.getRole());
            account.setRoles(new HashSet<Role>(List.of(role)));
        }
        if (accountUpdateDTO.getBanned() != null) {
            if (accountUpdateDTO.getBanned().equals("Yes")) {
                System.out.println("LOCKEED");
                account.setLocked(true);
            } else if (accountUpdateDTO.getBanned().equals("No")) {
                account.setLocked(false);
            }
        }
        accountRepository.save(account);
        return ResponseEntity.ok(account);
    }

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllAccounts() {
        List<Account> accounts = accountRepository.findAll();
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/isfavorite/{userId}/{productId}")
    public ResponseEntity<?> isFavorite(@PathVariable("userId") Long userId,
                                        @PathVariable("productId") Integer productId)
    {
        try {
            Optional<Favorite> favorite = favoriteRepository.findByProductIdAndAccountId(productId, userId);

            if(favorite.isEmpty()) {
                return ResponseEntity.ok("false");
            }

            return ResponseEntity.ok("true");
        } catch (RuntimeException e) {
            String errorMessage = e.getMessage();
            HttpStatus status = HttpStatus.UNAUTHORIZED; // 401

            return new ResponseEntity<>(errorMessage, status);
        }
    }

    @PostMapping("/deletefavorite")
    public ResponseEntity<?> removeFavorite(@RequestBody SaveFavoriteRequest saveFavoriteRequest) {
        try {
            if(accountRepository.findByEmail(saveFavoriteRequest.getEmail()).isEmpty()) {
                return new ResponseEntity<>("Account not found", HttpStatus.NOT_FOUND);
            }
            Account account = accountRepository.findByEmail(saveFavoriteRequest.getEmail()).get();

            Optional<Favorite> favorite = favoriteRepository.findByProductIdAndAccountId(saveFavoriteRequest.getProductId(), account.getId());

            Product product = productsService.findById(saveFavoriteRequest.getProductId());
            product.setUserCountSaved(product.getUserCountSaved() != null ? product.getUserCountSaved() - 1 : 0);
            productsRepository.save(product);

            favorite.ifPresent(favoriteRepository::delete);

            return ResponseEntity.ok("deleted");
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/favorite")
    public ResponseEntity<?> saveFavorite(@RequestBody SaveFavoriteRequest saveFavoriteRequest) {
        try {
            if(accountRepository.findByEmail(saveFavoriteRequest.getEmail()).isEmpty()) {
                return new ResponseEntity<>("Account not found", HttpStatus.NOT_FOUND);
            }
            Account account = accountRepository.findByEmail(saveFavoriteRequest.getEmail()).get();

            Optional<Favorite> favorite = favoriteRepository.findByProductIdAndAccountId(saveFavoriteRequest.getProductId(), account.getId());

            Product product = productsService.findById(saveFavoriteRequest.getProductId());
            product.setUserCountSaved(product.getUserCountSaved() != null ? product.getUserCountSaved() + 1 : 1);
            productsRepository.save(product);

            if (favorite.isPresent()) {
                return ResponseEntity.ok("saved");
            }

            Favorite newFavorite = new Favorite(null, saveFavoriteRequest.getProductId(), account.getId());
            favoriteRepository.save(newFavorite);

            return ResponseEntity.ok("saved");
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
            HttpStatus status = HttpStatus.UNAUTHORIZED;

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

        try {
            accountService.changePasswordAndSendVerificationEmail(email, oldPassword);
        } catch (AccountNotFoundException e) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        } catch (BadCredentialsException e) {
            return new ResponseEntity<>("Invalid password", HttpStatus.UNAUTHORIZED);
        }

        return ResponseEntity.ok(HttpStatus.OK);
    }

    @PostMapping("/change/password/submit")
    public ResponseEntity<?> changePasswordSubmit(@RequestBody Map<String, String> requestBody) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        String newPassword = requestBody.get("new_password");
        String code = requestBody.get("code");

        try {
            accountService.saveNewPasswordAndVerifyCode(email, newPassword, code);
        } catch (AccountNotFoundException e) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        } catch (BadCredentialsException e) {
            return new ResponseEntity<>("Invalid code", HttpStatus.UNAUTHORIZED);
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
