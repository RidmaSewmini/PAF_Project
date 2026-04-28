package backend.Controller;

import backend.Repository.UserRepository;
import backend.email.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class UserAuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @PostMapping("/verify-email")
    public ResponseEntity<Map<String, Object>> verifyEmail(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String code = payload.get("code");

        if (email == null || code == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and code are required"));
        }

        return userRepository.findAllByEmail(email).map(user -> {
            if (user.isVerified()) {
                return ResponseEntity.badRequest().body(Map.<String, Object>of("message", "User is already verified"));
            }

            if (!code.equals(user.getVerificationCode())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.<String, Object>of("message", "Invalid verification code"));
            }

            if (user.getVerificationExpiry() == null || user.getVerificationExpiry().before(new java.util.Date())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.<String, Object>of("message", "Verification code expired"));
            }

            user.setVerified(true);
            user.setVerificationCode(null);
            user.setVerificationExpiry(null);
            userRepository.save(user);

            // Send Welcome Email
            emailService.sendWelcomeEmail(user.getEmail(), user.getName());

            return ResponseEntity.ok(Map.<String, Object>of("message", "Email verified successfully"));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found")));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<Map<String, Object>> resendVerification(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");

        if (email == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }

        return userRepository.findAllByEmail(email).map(user -> {
            if (user.isVerified()) {
                return ResponseEntity.badRequest().body(Map.<String, Object>of("message", "User is already verified"));
            }

            String code = String.format("%06d", new Random().nextInt(999999));
            user.setVerificationCode(code);
            user.setVerificationExpiry(new java.util.Date(System.currentTimeMillis() + 15 * 60 * 1000));
            userRepository.save(user);

            emailService.sendVerificationEmail(user.getEmail(), code);

            return ResponseEntity.ok(Map.<String, Object>of("message", "Verification code sent"));
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found")));
    }
}
