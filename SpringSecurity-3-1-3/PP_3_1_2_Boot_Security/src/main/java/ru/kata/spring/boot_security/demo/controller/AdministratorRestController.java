package ru.kata.spring.boot_security.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserDetailsServiceImpl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdministratorRestController {
    private final UserDetailsServiceImpl userDetailsService;

    private final RoleService roleService;

    public AdministratorRestController(UserDetailsServiceImpl userDetailsService, RoleService roleService) {
        this.userDetailsService = userDetailsService;
        this.roleService = roleService;
    }

    @GetMapping()
    public ResponseEntity apiGetAllUsers() {
        List<User> users = userDetailsService.listUser();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }
    @GetMapping("/user")
    public ResponseEntity<User> apiGetUserAuntificated(){
        User user = userDetailsService.get(userDetailsService.getCurrentUsername());
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping()
    public ResponseEntity<HttpStatus> apiAddNewUser(@RequestBody User user) {
        userDetailsService.add(user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> apiGetUser(@PathVariable("id") Long id) {
        User user = userDetailsService.get(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

   @PutMapping("/{id}")
    public ResponseEntity<HttpStatus> apiUpdateUser(@PathVariable Long id, @RequestBody User user) {
        user.setId(id);
        userDetailsService.update(user);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> apiDeleteUser(@PathVariable Long id) {
        userDetailsService.delete(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
