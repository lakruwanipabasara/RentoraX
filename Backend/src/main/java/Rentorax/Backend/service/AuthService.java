package Rentorax.Backend.service;

import Rentorax.Backend.dto.ApiResponse;
import Rentorax.Backend.dto.LoginRequest;
import Rentorax.Backend.dto.RegisterRequest;
import Rentorax.Backend.model.User;
import Rentorax.Backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    private static final String ADMIN_EMAIL = "admin@gmail.com";
    private static final String ADMIN_PASSWORD = "admin@123";

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ApiResponse register(RegisterRequest request) {

        if (request.getEmail().equalsIgnoreCase(ADMIN_EMAIL)) {
            return new ApiResponse(false, "This email is reserved for admin", null);
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return new ApiResponse(false, "Passwords do not match", null);
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return new ApiResponse(false, "Email already exists", null);
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        user.setAddressLine1(request.getAddressLine1());
        user.setAddressLine2(request.getAddressLine2());
        user.setAddressLine3(request.getAddressLine3());

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setProfileImage(null);

        user.setRole("CUSTOMER");

        User savedUser = userRepository.save(user);

        Map<String, Object> userData = new HashMap<>();

        userData.put("id", savedUser.getId());
        userData.put("name", savedUser.getName());
        userData.put("email", savedUser.getEmail());
        userData.put("phone", savedUser.getPhone());
        userData.put("addressLine1", savedUser.getAddressLine1());
        userData.put("addressLine2", savedUser.getAddressLine2());
        userData.put("addressLine3", savedUser.getAddressLine3());
        userData.put("profileImage", savedUser.getProfileImage());
        userData.put("role", savedUser.getRole());

        return new ApiResponse(true, "Customer registered successfully", userData);
    }

    public ApiResponse login(LoginRequest request) {

        if (request.getEmail().equalsIgnoreCase(ADMIN_EMAIL)) {

            if (!request.getPassword().equals(ADMIN_PASSWORD)) {
                return new ApiResponse(false, "Invalid admin email or password", null);
            }

            Map<String, Object> adminData = new HashMap<>();

            adminData.put("id", "admin");
            adminData.put("name", "Admin");
            adminData.put("email", ADMIN_EMAIL);
            adminData.put("phone", "");
            adminData.put("addressLine1", "");
            adminData.put("addressLine2", "");
            adminData.put("addressLine3", "");
            adminData.put("profileImage", null);
            adminData.put("role", "ADMIN");
            adminData.put("rememberMe", request.isRememberMe());

            return new ApiResponse(true, "Admin login successful", adminData);
        }

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            return new ApiResponse(false, "Invalid email or password", null);
        }

        boolean passwordMatches = passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        );

        if (!passwordMatches) {
            return new ApiResponse(false, "Invalid email or password", null);
        }

        user.setRole("CUSTOMER");
        userRepository.save(user);

        Map<String, Object> userData = new HashMap<>();

        userData.put("id", user.getId());
        userData.put("name", user.getName());
        userData.put("email", user.getEmail());
        userData.put("phone", user.getPhone());

        userData.put("addressLine1", user.getAddressLine1());
        userData.put("addressLine2", user.getAddressLine2());
        userData.put("addressLine3", user.getAddressLine3());

        userData.put("profileImage", user.getProfileImage());
        userData.put("role", "CUSTOMER");

        userData.put("rememberMe", request.isRememberMe());

        return new ApiResponse(true, "Customer login successful", userData);
    }
}