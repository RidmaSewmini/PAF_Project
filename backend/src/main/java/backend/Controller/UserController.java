package backend.Controller;

import backend.Exception.UserNotFoundException;
import backend.Model.UserModel;
import backend.Repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import backend.email.EmailService;
import backend.notification.NotificationService;
import backend.audit.AuditService;
import backend.service.ImageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AuditService auditService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private ImageService imageService;

    // Create new user
    @PostMapping("/users")
    public UserModel newUserModel(@RequestBody UserModel newUserModel) {

        newUserModel.setPassword(passwordEncoder.encode(newUserModel.getPassword()));
        newUserModel.setRole(UserModel.Role.USER);
        
        // Generate Verification Code
        String code = String.format("%06d", new Random().nextInt(999999));
        newUserModel.setVerificationCode(code);
        newUserModel.setVerificationExpiry(new java.util.Date(System.currentTimeMillis() + 15 * 60 * 1000)); // 15 mins
        newUserModel.setVerified(false);

        UserModel savedUser = userRepository.save(newUserModel);
        
        // Send Verification Email
        emailService.sendVerificationEmail(savedUser.getEmail(), code);
        
        return savedUser;
    }

    // User Login
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody UserModel loginDetails) {
        UserModel user = userRepository.findAllByEmail(loginDetails.getEmail())
                .orElseThrow(() -> new UserNotFoundException(loginDetails.getEmail()));

        if (passwordEncoder.matches(loginDetails.getPassword(), user.getPassword())) {
            if (user.getRole() != UserModel.Role.USER) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Access denied. Use admin login."));
            }
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("id", user.getId());
            response.put("role", user.getRole().toString());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Wrong Password"));
        }
    }

    // Admin Login
    @PostMapping("/admin/login")
    public ResponseEntity<Map<String, Object>> adminLogin(@RequestBody UserModel loginDetails) {
        UserModel user = userRepository.findAllByEmail(loginDetails.getEmail())
                .orElseThrow(() -> new UserNotFoundException(loginDetails.getEmail()));

        if (passwordEncoder.matches(loginDetails.getPassword(), user.getPassword())) {
            if (user.getRole() != UserModel.Role.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Forbidden: Not an admin"));
            }
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("id", user.getId());
            response.put("role", user.getRole().toString());

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Wrong Password"));
        }
    }

    // Get all users
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<UserModel> users = userRepository.findAll();
            users.forEach(user -> {
                if (user.getProfileImageUrl() == null) {
                    user.setProfileImageUrl("");
                }
                if (user.getProfileImagePublicId() == null) {
                    user.setProfileImagePublicId("");
                }
            });
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            e.printStackTrace(); // IMPORTANT for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Error fetching users"));
        }

    }

    // Get user by id
    @GetMapping("/users/{id}")
    public UserModel getUserById(@PathVariable String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + id));
    }

    // Update User
    @PutMapping("/users/{id}")
    public UserModel updateUser(
            @PathVariable String id,
            @RequestBody UserModel newUserModel,
            HttpServletRequest request
    ) {
        return userRepository.findById(id).map(userModel -> {
            boolean hasChanges = false;
            
            if (newUserModel.getName() != null && !newUserModel.getName().equals(userModel.getName())) {
                userModel.setName(newUserModel.getName());
                hasChanges = true;
            }
            if (newUserModel.getEmail() != null && !newUserModel.getEmail().equals(userModel.getEmail())) {
                userModel.setEmail(newUserModel.getEmail());
                hasChanges = true;
            }

            if (newUserModel.getPassword() != null && !newUserModel.getPassword().isEmpty()) {
                userModel.setPassword(passwordEncoder.encode(newUserModel.getPassword()));
                hasChanges = true;
            }

            if (newUserModel.getRole() != null && newUserModel.getRole() != userModel.getRole()) {
                userModel.setRole(newUserModel.getRole());
                hasChanges = true;
            }

            if (newUserModel.isVerified() != userModel.isVerified()) {
                userModel.setVerified(newUserModel.isVerified());
                hasChanges = true;
            }

            UserModel updatedUser = userRepository.save(userModel);

            if (updatedUser != null && hasChanges) {
                System.out.println("Admin update triggered notification for user: " + updatedUser.getId());
                notificationService.createNotification(
                    updatedUser.getId(),
                    "Your profile was updated by admin",
                    "PROFILE_UPDATE"
                );
            }

            if (hasChanges) {
                auditService.logAction(
                    "USER_UPDATED",
                    "USER",
                    updatedUser.getId(),
                    updatedUser.getName(),
                    "Admin updated user profile",
                    Map.of("changes_made", true),
                    request
                );
            }

            return updatedUser;

        }).orElseThrow(() -> new UserNotFoundException("User not found: " + id));
    }

    // Delete User
    @DeleteMapping("/users/{id}")
    public String deleteProfile(@PathVariable String id, HttpServletRequest request) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("User not found: " + id);
        }
        
        // Capture name before delete
        UserModel target = userRepository.findById(id).get();
        
        userRepository.deleteById(id);

        auditService.logAction(
            "USER_DELETED",
            "USER",
            id,
            target.getName(),
            "Admin deleted a user",
            Map.of("deleted", true),
            request
        );

        return "User " + id + " has been deleted";
    }

    // ── Profile and Password Endpoints ─────────────────────────────────────

    // ── Profile and Password Endpoints ─────────────────────────────────────



    @PutMapping("/users/{id}/profile")
    public UserModel updateUserProfile(
            @PathVariable String id,
            @RequestBody UserModel profileData
    ) {
        return userRepository.findById(id).map(user -> {
            boolean isUpdated = false;
            // Update name
            if (profileData.getName() != null && !profileData.getName().isEmpty() && !profileData.getName().equals(user.getName())) {
                user.setName(profileData.getName());
                isUpdated = true;
            }
            // Update password if provided
            if (profileData.getPassword() != null && !profileData.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(profileData.getPassword()));
                isUpdated = true;
            }
            
            UserModel savedUser = userRepository.save(user);

            if (isUpdated) {
                notificationService.createNotification(id, "Your profile was updated successfully", "PROFILE_UPDATE");
            }
            return savedUser;
        }).orElseThrow(() -> new UserNotFoundException("User not found: " + id));
    }

    @PostMapping("/users/{id}/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(
            @PathVariable String id,
            @RequestBody Map<String, Object> payload
    ) {
        UserModel user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + id));

        String currentPassword = (String) payload.get("currentPassword");
        String newPassword = (String) payload.get("newPassword");

        if (currentPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.<String, Object>of("message", "Passwords cannot be empty"));
        }

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.<String, Object>of("message", "Incorrect current password"));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(Map.<String, Object>of("message", "Password changed successfully"));
    }

    @PostMapping("/users/reset-password/request")
    public ResponseEntity<Map<String, Object>> requestPasswordReset(@RequestBody Map<String, Object> payload) {
        String email = (String) payload.get("email");
        if (email == null) {
            return ResponseEntity.badRequest().body(Map.<String, Object>of("message", "Email is required"));
        }

        return userRepository.findAllByEmail(email).map(user -> {
            String token = java.util.UUID.randomUUID().toString();
            user.setResetToken(token);
            // Set expiry to 1 hour from now
            user.setTokenExpiry(new java.util.Date(System.currentTimeMillis() + 3600000));
            userRepository.save(user);

            // Send password reset email via Mailtrap
            String resetUrl = "http://localhost:3000/reset-password?token=" + token;
            emailService.sendPasswordResetEmail(user.getEmail(), resetUrl);

            return ResponseEntity.ok(Map.<String, Object>of("message", "Password reset instructions sent"));
        }).orElse(ResponseEntity.ok(Map.<String, Object>of("message", "If an account exists, reset instructions have been sent")));
    }

    @PostMapping("/users/reset-password/confirm")
    public ResponseEntity<Map<String, Object>> confirmPasswordReset(@RequestBody Map<String, Object> payload) {
        String token = (String) payload.get("token");
        String newPassword = (String) payload.get("newPassword");

        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.<String, Object>of("message", "Invalid request"));
        }

        return userRepository.findByResetToken(token).map(user -> {
            if (user.getTokenExpiry() == null || user.getTokenExpiry().before(new java.util.Date())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.<String, Object>of("message", "Token expired"));
            }

            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetToken(null);
            user.setTokenExpiry(null);
            userRepository.save(user);

            // Send password reset success email
            emailService.sendPasswordResetSuccessEmail(user.getEmail());

            return ResponseEntity.ok(Map.<String, Object>of("message", "Password reset successfully"));
        }).orElse(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.<String, Object>of("message", "Invalid token")));
    }

    @PostMapping("/users/profile-image")
    public ResponseEntity<Map<String, Object>> uploadUserProfileImage(
            @RequestParam("userId") String userId,
            @RequestParam("file") MultipartFile file) {
        
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));

        try {
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.<String, Object>of("message", "File too large. Max size is 5MB."));
            }
            
            if (user.getProfileImagePublicId() != null) {
                imageService.deleteImage(user.getProfileImagePublicId());
            }

            Map<String, String> uploadResult = imageService.uploadImage(file);
            user.setProfileImageUrl(uploadResult.get("url"));
            user.setProfileImagePublicId(uploadResult.get("publicId"));
            userRepository.save(user);

            return ResponseEntity.ok(Map.<String, Object>of("message", "Profile image updated successfully", "url", uploadResult.get("url")));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.<String, Object>of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/users/profile-image")
    public ResponseEntity<Map<String, Object>> deleteUserProfileImage(@RequestParam("userId") String userId) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found: " + userId));

        if (user.getProfileImagePublicId() != null) {
            imageService.deleteImage(user.getProfileImagePublicId());
            user.setProfileImageUrl(null);
            user.setProfileImagePublicId(null);
            userRepository.save(user);
        }

        return ResponseEntity.ok(Map.<String, Object>of("message", "Profile image removed successfully"));
    }
}
