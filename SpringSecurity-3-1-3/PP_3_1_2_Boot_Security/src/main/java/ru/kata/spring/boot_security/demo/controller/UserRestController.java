package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserDetailsServiceImpl;

@RestController
@RequestMapping("/api")
public class UserRestController {
    private final UserDetailsServiceImpl userDetailsService;

    public UserRestController(UserDetailsServiceImpl userDetailsService) {
        this.userDetailsService = userDetailsService;

    }
    @GetMapping("/user")
    public ResponseEntity<User> apiGetUser() {
        User user = userDetailsService.get(userDetailsService.getCurrentUsername());
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

}
