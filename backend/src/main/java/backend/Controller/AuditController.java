package backend.Controller;

import backend.Model.AuditLog;
import backend.Repository.AuditLogRepository;
import backend.service.AuditService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.io.ByteArrayOutputStream;

@RestController
@RequestMapping("/admin/audit")
@CrossOrigin(origins = "http://localhost:3000")
public class AuditController {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private AuditService auditService;

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAuditLogs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String actionType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(auditService.getFilteredLogs(search, actionType, page, size));
    }

    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadAuditLogs() {
        List<AuditLog> allLogs = auditLogRepository.findAll();

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();

            document.add(new Paragraph("Audit Logs Report"));
            document.add(new Paragraph(" ")); // blank line

            for (AuditLog log : allLogs) {
                String logEntry = String.format("[%s] %s | Admin: %s | Target: %s",
                        log.getTimestamp(), log.getActionType(), log.getAdminName(), log.getTargetName());
                document.add(new Paragraph(logEntry));
            }

            document.close();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "audit_logs.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(out.toByteArray());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<String> clearAuditLogs() {
        auditLogRepository.deleteAll();
        return ResponseEntity.ok("Audit logs cleared successfully");
    }
}
