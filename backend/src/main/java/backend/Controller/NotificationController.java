package backend.Controller;

import backend.Model.Notification;
import backend.Repository.UserRepository;
import backend.service.NotificationService;

import backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    private boolean userExists(String userId) {
        return userRepository.existsById(userId);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserNotifications(@PathVariable String userId) {
        if (!userExists(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }
        Page<Notification> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications.getContent());
    }

    @PostMapping("/create")
    public ResponseEntity<?> createNotification(@RequestBody Map<String, String> payload) {
        String userId = payload.get("userId");
        String message = payload.get("message");
        String type = payload.get("type");

        if (userId == null || message == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "userId and message are required"));
        }
        if (!userExists(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }

        Notification notif = notificationService.createNotification(userId, message, type);
        return ResponseEntity.ok(notif);
    }

    @PutMapping("/read/{id}")
    public ResponseEntity<?> markAsRead(@PathVariable String id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(Map.of("message", "Marked as read"));
    }

    @PutMapping("/unread/{id}")
    public ResponseEntity<?> markAsUnread(@PathVariable String id) {
        notificationService.markAsUnread(id);
        return ResponseEntity.ok(Map.of("message", "Marked as unread"));
    }

    @PutMapping("/read-all/{userId}")
    public ResponseEntity<?> markAllAsRead(@PathVariable String userId) {
        if (!userExists(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    @PutMapping("/seen/{userId}")
    public ResponseEntity<?> markAllAsSeen(@PathVariable String userId) {
        if (!userExists(userId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found"));
        }
        notificationService.markAllAsSeen(userId);
        return ResponseEntity.ok(Map.of("message", "All notifications marked as seen"));
    }
}
