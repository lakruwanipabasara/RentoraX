package Rentorax.Backend.controller;

import Rentorax.Backend.dto.ApiResponse;
import Rentorax.Backend.dto.ChangePasswordRequest;
import Rentorax.Backend.dto.ProfileImageRequest;
import Rentorax.Backend.dto.UpdateProfileRequest;
import Rentorax.Backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5174"
})
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile/{id}")
    public ApiResponse getProfile(@PathVariable String id) {
        return userService.getProfile(id);
    }

    @PutMapping("/profile/{id}")
    public ApiResponse updateProfile(
            @PathVariable String id,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return userService.updateProfile(id, request);
    }

    @PutMapping("/profile-image/{id}")
    public ApiResponse updateProfileImage(
            @PathVariable String id,
            @RequestBody ProfileImageRequest request
    ) {
        return userService.updateProfileImage(id, request);
    }

    @PutMapping("/change-password/{id}")
    public ApiResponse changePassword(
            @PathVariable String id,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        return userService.changePassword(id, request);
    }

    @GetMapping("/activity/{id}")
    public ApiResponse getActivity(@PathVariable String id) {
        return userService.getActivity(id);
    }
}