package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserDetailsServiceImpl;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import java.util.Collection;
import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdministratorController {
    public final UserDetailsServiceImpl userService;
    private final RoleService roleService;

    @Autowired
    public AdministratorController(UserDetailsServiceImpl userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }
    @GetMapping()
    public String getAllUsers(Model model) {
        model.addAttribute("allUsers", userService.listUser());
        model.addAttribute("userNew", new User());
        model.addAttribute("user", userService.loadUserByUsername(userService.getCurrentUsername()));
        model.addAttribute("roleList", roleService.getRoleList());
        return "admin";
    }
    @PostMapping()
    public String addUser(@ModelAttribute("userNew") User user, @RequestParam("role") List<String> role) {
        Collection<Role> roleList = userService.getSetOfRoles(role);
        user.setRoles(roleList);
        userService.add(user);
        return "redirect:/admin";
    }

    @GetMapping("/{id}")
    public  String deleteUser(@PathVariable("id") Long id) {
        userService.delete(id);
        return "redirect:/admin";
    }

    @PostMapping("/update/{id}")
    public String updateUser(@ModelAttribute("editUser") User user, @PathVariable("id") Long id, @RequestParam("roleList") List<String> role) {
        user.setRoles(userService.getSetOfRoles(role));
        user.setId(id);
        userService.update(user);
        return "redirect:/admin";
    }

}
