package Rentorax.Backend.service;

import Rentorax.Backend.dto.ApiResponse;
import Rentorax.Backend.dto.ChangePasswordRequest;
import Rentorax.Backend.dto.ProfileImageRequest;
import Rentorax.Backend.dto.UpdateProfileRequest;
import Rentorax.Backend.model.User;
import Rentorax.Backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ApiResponse getProfile(String id) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return new ApiResponse(false, "User not found", null);
        }

        Map<String, Object> profile = new HashMap<>();

        profile.put("id", user.getId());
        profile.put("name", user.getName());
        profile.put("email", user.getEmail());
        profile.put("phone", user.getPhone());

        profile.put("addressLine1", user.getAddressLine1());
        profile.put("addressLine2", user.getAddressLine2());
        profile.put("addressLine3", user.getAddressLine3());

        profile.put("profileImage", user.getProfileImage());

        String fullAddress = "";

        if (user.getAddressLine1() != null) {
            fullAddress += user.getAddressLine1();
        }

        if (user.getAddressLine2() != null && !user.getAddressLine2().isBlank()) {
            fullAddress += ", " + user.getAddressLine2();
        }

        if (user.getAddressLine3() != null && !user.getAddressLine3().isBlank()) {
            fullAddress += ", " + user.getAddressLine3();
        }

        profile.put("address", fullAddress);

        return new ApiResponse(true, "Profile loaded successfully", profile);
    }

    public ApiResponse updateProfile(String id, UpdateProfileRequest request) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return new ApiResponse(false, "User not found", null);
        }

        User existingEmailUser = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (existingEmailUser != null && !existingEmailUser.getId().equals(id)) {
            return new ApiResponse(false, "Email already used by another account", null);
        }

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setAddressLine1(request.getAddressLine1());
        user.setAddressLine2(request.getAddressLine2());
        user.setAddressLine3(request.getAddressLine3());

        User updatedUser = userRepository.save(user);
        updatedUser.setPassword(null);

        return new ApiResponse(true, "Profile updated successfully", updatedUser);
    }

    public ApiResponse updateProfileImage(String id, ProfileImageRequest request) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return new ApiResponse(false, "User not found", null);
        }

        user.setProfileImage(request.getProfileImage());
        userRepository.save(user);

        return new ApiResponse(true, "Profile image updated successfully", user.getProfileImage());
    }

    public ApiResponse changePassword(String id, ChangePasswordRequest request) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return new ApiResponse(false, "User not found", null);
        }

        boolean currentPasswordCorrect = passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword()
        );

        if (!currentPasswordCorrect) {
            return new ApiResponse(false, "Current password is incorrect", null);
        }

        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            return new ApiResponse(false, "New passwords do not match", null);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return new ApiResponse(true, "Password updated successfully", null);
    }

    public ApiResponse getActivity(String id) {

        User user = userRepository.findById(id).orElse(null);

        if (user == null) {
            return new ApiResponse(false, "User not found", null);
        }

        Map<String, Object> activity = new HashMap<>();

        activity.put("events", List.of(
                "Camera rental - Mar 20",
                "Bike rental - Mar 15"
        ));

        activity.put("orders", List.of(
                "Order #1023 - Canon EOS R5",
                "Order #1024 - DJI Drone"
        ));

        activity.put("reminders", List.of(
                "Return camera tomorrow",
                "Pickup bike at 10 AM"
        ));

        return new ApiResponse(true, "Activity loaded successfully", activity);
    }
}