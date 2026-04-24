package backend.Controller;

import backend.Exception.UserNotFoundException;
import backend.Model.UserModel;
import backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import backend.service.NotificationService;
import backend.service.AuditService;
import backend.service.ImageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuditService auditService;

    @Autowired
    private ImageService imageService;

    @PostMapping("/users")
    public UserModel createUserByAdmin(@RequestBody UserModel userData, HttpServletRequest request) {

        userData.setPassword(passwordEncoder.encode(userData.getPassword()));

        // Admin can assign role directly
        if (userData.getRole() == null) {
            userData.setRole(UserModel.Role.USER);
        }

        // Admin can auto-verify user
        userData.setVerified(true);
        userData.setVerificationCode(null);
        userData.setVerificationExpiry(null);

        UserModel savedUser = userRepository.save(userData);

        // Optional notification
        notificationService.createNotification(
                savedUser.getId(),
                "Your account has been created by admin",
                "ACCOUNT_CREATED");

        auditService.logAction(
                "USER_CREATED",
                "USER",
                savedUser.getId(),
                savedUser.getName(),
                "Admin created a new user",
                Map.of("email", savedUser.getEmail(), "role", savedUser.getRole()),
                request);

        return savedUser;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", 142);
        stats.put("activeBookings", 35);
        stats.put("pendingTickets", 12);
        stats.put("resources", 8);
        return stats;
    }

    @GetMapping("/recent-users")
    public List<Map<String, String>> getRecentUsers() {
        List<Map<String, String>> users = new ArrayList<>();

        Map<String, String> user1 = new HashMap<>();
        user1.put("name", "Alice Smith");
        user1.put("email", "alice@example.com");
        user1.put("role", "USER");
        users.add(user1);

        Map<String, String> user2 = new HashMap<>();
        user2.put("name", "Bob Jones");
        user2.put("email", "bob@example.com");
        user2.put("role", "USER");
        users.add(user2);

        Map<String, String> user3 = new HashMap<>();
        user3.put("name", "Charlie Day");
        user3.put("email", "charlie@example.com");
        user3.put("role", "USER");
        users.add(user3);

        return users;
    }

    @PutMapping("/{id}/profile")
    public UserModel updateAdminProfile(
            @PathVariable String id,
            @RequestBody UserModel profileData) {
        return userRepository.findById(id).map(user -> {

            if (user.getRole() != UserModel.Role.ADMIN) {
                throw new UserNotFoundException("Admin not found: " + id);
            }

            boolean updated = false;

            if (profileData.getName() != null && !profileData.getName().isEmpty()) {
                user.setName(profileData.getName());
                updated = true;
            }

            if (profileData.getPassword() != null && !profileData.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(profileData.getPassword()));
                updated = true;
            }

            UserModel savedUser = userRepository.save(user);

            if (updated) {
                notificationService.createNotification(
                        user.getId(),
                        "Your admin profile was updated successfully",
                        "PROFILE_UPDATE");
            }

            return savedUser;

        }).orElseThrow(() -> new UserNotFoundException("Admin not found: " + id));
    }

    @PostMapping("/profile-image")
    public ResponseEntity<Map<String, Object>> uploadAdminProfileImage(
            @RequestParam("userId") String userId,
            @RequestParam("file") MultipartFile file) {

        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Admin not found: " + userId));

        if (user.getRole() != UserModel.Role.ADMIN) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.<String, Object>of("message", "Only admins can use this endpoint."));
        }

        try {
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.<String, Object>of("message", "File too large. Max size is 5MB."));
            }

            if (user.getProfileImagePublicId() != null) {
                imageService.deleteImage(user.getProfileImagePublicId());
            }

            Map<String, String> uploadResult = imageService.uploadImage(file);
            user.setProfileImageUrl(uploadResult.get("url"));
            user.setProfileImagePublicId(uploadResult.get("publicId"));
            userRepository.save(user);

            return ResponseEntity.ok(Map.<String, Object>of("message", "Admin profile image updated successfully",
                    "url", uploadResult.get("url")));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.<String, Object>of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/profile-image")
    public ResponseEntity<Map<String, Object>> deleteAdminProfileImage(@RequestParam("userId") String userId) {
        UserModel user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("Admin not found: " + userId));

        if (user.getProfileImagePublicId() != null) {
            imageService.deleteImage(user.getProfileImagePublicId());
            user.setProfileImageUrl(null);
            user.setProfileImagePublicId(null);
            userRepository.save(user);
        }

        return ResponseEntity.ok(Map.<String, Object>of("message", "Admin profile image removed successfully"));
    }
}
