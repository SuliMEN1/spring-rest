package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.service.UserDetailsServiceImpl;


@Controller
@RequestMapping("/user")
public class UserController {

    public final UserDetailsServiceImpl userService;


    @Autowired
    public UserController(UserDetailsServiceImpl userService) {
        this.userService = userService;
    }

    @GetMapping()
    public String findUser(Model model) {
        model.addAttribute("user", userService.loadUserByUsername(userService.getCurrentUsername()));
        model.addAttribute("userModel", userService.get(userService.getCurrentUsername()));
        return "user";
    }
}
