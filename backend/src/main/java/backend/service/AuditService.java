package backend.service;

import backend.Model.AuditLog;
import backend.Model.UserModel;
import backend.Repository.AuditLogRepository;
import backend.Repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AuditService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private UserRepository userRepository;

    public void logAction(
            String actionType,
            String targetType,
            String targetId,
            String targetName,
            String description,
            Map<String, Object> changes,
            HttpServletRequest request) {

        AuditLog log = new AuditLog();
        log.setActionType(actionType);
        log.setTargetType(targetType);
        log.setTargetId(targetId);
        log.setTargetName(targetName);
        log.setDescription(description);
        log.setChanges(changes);
        log.setStatus("SUCCESS");
        log.setTimestamp(LocalDateTime.now());

        if (request != null) {
            String adminId = request.getHeader("X-Admin-ID");
            if (adminId == null || adminId.isEmpty()) {
                log.setAdminId("UNKNOWN_ADMIN");
                log.setAdminName("Unknown");
                log.setAdminEmail("Unknown");
            } else {
                log.setAdminId(adminId);
                Optional<UserModel> adminOpt = userRepository.findById(adminId);
                if (adminOpt.isPresent()) {
                    log.setAdminName(adminOpt.get().getName());
                    log.setAdminEmail(adminOpt.get().getEmail());
                } else {
                    log.setAdminName("Unknown Admin ID");
                    log.setAdminEmail("Unknown");
                }
            }
            log.setIpAddress(request.getRemoteAddr());
            log.setUserAgent(request.getHeader("User-Agent"));
        } else {
            log.setAdminId("SYSTEM");
            log.setAdminName("System");
            log.setAdminEmail("system@local");
            log.setIpAddress("localhost");
            log.setUserAgent("internal");
        }

        auditLogRepository.save(log);
    }

    public List<AuditLog> getFilteredLogs(String search, String actionType, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("timestamp").descending());

        if ((search == null || search.isEmpty()) && (actionType == null || actionType.isEmpty())) {
            return auditLogRepository.findAll(pageable).getContent();
        }

        return auditLogRepository.searchLogs(search, actionType, pageable).getContent();
    }
}
