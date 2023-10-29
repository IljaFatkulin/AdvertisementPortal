package iljafatkulin.advertisement.portal.service.impl;

import iljafatkulin.advertisement.portal.model.Account;
import iljafatkulin.advertisement.portal.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
//public class UserDetailsServiceImpl implements UserDetailsService {
public class UserDetailsServiceImpl {
    private final AccountService accountService;

//    @Override
//    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
//        Account account = accountService.findByEmail(email);
//        if(account == null) {
//            throw new UsernameNotFoundException("User" + email + " not found");
//        }
//        if(account.getRoles() == null || account.getRoles().isEmpty()) {
//            throw new RuntimeException("User has no roles");
//        }
//
//        Collection<GrantedAuthority> authorities = account.getRoles().stream()
//                .map(role -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toList());
//
//        return new User(account.getEmail(), account.getPassword(), account.isEnabled(),
//                !account.isExpired(), !account.isCredentialsExpired(), !account.isLocked(), authorities);
//    }
}
