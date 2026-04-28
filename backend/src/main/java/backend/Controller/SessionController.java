package backend.Controller;

import backend.service.SessionService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "http://localhost:3000")
public class SessionController {

    @Autowired
    private SessionService sessionService;

    // Helper method to simulate getting user from Context/Token
    // In a real JWT setup, this would be injected or parsed from SecurityContext
    private String getCurrentUserId(HttpServletRequest request) {
        // Since the current frontend implementation sends the user ID in some way (or we just use a header for now)
        // We will assume the frontend sends a "X-User-Id" header for authenticated requests until JWT is fully implemented
        return request.getHeader("X-User-Id");
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getSessions(HttpServletRequest request) {
        String userId = getCurrentUserId(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        
        String currentSessionId = request.getHeader("X-Session-Id");
        List<Map<String, Object>> sessions = sessionService.getActiveSessions(userId, currentSessionId);
        return ResponseEntity.ok(sessions);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> terminateSession(@PathVariable String id, HttpServletRequest request) {
        String userId = getCurrentUserId(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        
        boolean terminated = sessionService.terminateSession(id, userId);
        if (terminated) {
            return ResponseEntity.ok(Map.of("message", "Session terminated"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/logout-all")
    public ResponseEntity<?> terminateAllSessions(HttpServletRequest request) {
        String userId = getCurrentUserId(request);
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        
        String currentSessionId = request.getHeader("X-Session-Id");
        sessionService.terminateAllSessions(userId, currentSessionId);
        return ResponseEntity.ok(Map.of("message", "All other sessions terminated"));
    }
}
