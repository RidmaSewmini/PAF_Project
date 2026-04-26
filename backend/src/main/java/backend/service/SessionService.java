package backend.service;

import backend.Model.Session;
import backend.Repository.SessionRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    public Session createSession(String userId, HttpServletRequest request) {
        String userAgentRaw = request.getHeader("User-Agent");
        String ipAddress = request.getRemoteAddr();
        
        // Simple device parsing
        String deviceInfo = "Unknown Device";
        if (userAgentRaw != null) {
            if (userAgentRaw.contains("Windows")) {
                deviceInfo = "Windows PC";
            } else if (userAgentRaw.contains("Mac OS X")) {
                deviceInfo = "Mac";
            } else if (userAgentRaw.contains("Linux")) {
                deviceInfo = "Linux PC";
            } else if (userAgentRaw.contains("Android")) {
                deviceInfo = "Android Device";
            } else if (userAgentRaw.contains("iPhone") || userAgentRaw.contains("iPad")) {
                deviceInfo = "iOS Device";
            } else {
                deviceInfo = "Web Browser"; // Fallback
            }
            
            // Add browser info to make it look nicer
            if (userAgentRaw.contains("Chrome") && !userAgentRaw.contains("Edg")) {
                deviceInfo += " (Chrome)";
            } else if (userAgentRaw.contains("Firefox")) {
                deviceInfo += " (Firefox)";
            } else if (userAgentRaw.contains("Safari") && !userAgentRaw.contains("Chrome")) {
                deviceInfo += " (Safari)";
            } else if (userAgentRaw.contains("Edg")) {
                deviceInfo += " (Edge)";
            }
        }

        Session session = new Session(
                userId,
                deviceInfo,
                userAgentRaw,
                ipAddress,
                LocalDateTime.now(),
                LocalDateTime.now(),
                true
        );

        return sessionRepository.save(session);
    }

    public List<Map<String, Object>> getActiveSessions(String userId, String currentSessionId) {
        List<Session> sessions = sessionRepository.findByUserIdAndIsActiveTrueOrderByLoginTimeDesc(userId);
        
        return sessions.stream().map(session -> {
            Map<String, Object> sessionMap = new HashMap<>();
            sessionMap.put("id", session.getId());
            sessionMap.put("deviceInfo", session.getDeviceInfo());
            sessionMap.put("ipAddress", session.getIpAddress());
            sessionMap.put("loginTime", session.getLoginTime());
            sessionMap.put("lastActive", session.getLastActive());
            sessionMap.put("isCurrent", session.getId().equals(currentSessionId));
            return sessionMap;
        }).collect(Collectors.toList());
    }

    public boolean terminateSession(String sessionId, String userId) {
        Optional<Session> sessionOpt = sessionRepository.findByIdAndUserId(sessionId, userId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            session.setActive(false);
            sessionRepository.save(session);
            return true;
        }
        return false;
    }

    public void terminateAllSessions(String userId, String currentSessionId) {
        List<Session> sessions = sessionRepository.findByUserIdAndIsActiveTrueOrderByLoginTimeDesc(userId);
        for (Session session : sessions) {
            if (currentSessionId == null || !session.getId().equals(currentSessionId)) {
                session.setActive(false);
                sessionRepository.save(session);
            }
        }
    }

    public void updateLastActive(String sessionId) {
        Optional<Session> sessionOpt = sessionRepository.findById(sessionId);
        if (sessionOpt.isPresent()) {
            Session session = sessionOpt.get();
            if (session.isActive()) {
                session.setLastActive(LocalDateTime.now());
                sessionRepository.save(session);
            }
        }
    }
}
