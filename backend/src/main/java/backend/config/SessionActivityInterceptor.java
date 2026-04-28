package backend.config;

import backend.service.SessionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class SessionActivityInterceptor implements HandlerInterceptor {

    @Autowired
    private SessionService sessionService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String sessionId = request.getHeader("X-Session-Id");
        
        // Only update for API requests that have a session ID, avoiding public static routes
        if (sessionId != null && !sessionId.isEmpty() && request.getRequestURI().startsWith("/api/")) {
            sessionService.updateLastActive(sessionId);
        }
        return true;
    }
}
