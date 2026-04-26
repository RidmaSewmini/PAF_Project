package backend.Controller;

import backend.Exception.ResourceNotFoundException;
import backend.Model.IncidentTicket;
import backend.Model.TicketStatus;
import backend.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:3000")
public class TicketController {

    private final TicketService ticketService;

    @Autowired
    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    // 1. POST /api/tickets: Create a new incident ticket with optional files. Returns 201 Created.
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createTicket(
            @RequestPart("ticket") String ticketJson,
            @RequestPart(value = "files", required = false) MultipartFile[] files) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());
            IncidentTicket ticket = mapper.readValue(ticketJson, IncidentTicket.class);
            
            IncidentTicket createdTicket = ticketService.createTicketWithFiles(ticket, files);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTicket);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<java.util.List<IncidentTicket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // 2. GET /api/tickets/{id}: Retrieve specific ticket details. Returns 200 OK or 404 Not Found.
    @GetMapping("/{id}")
    public ResponseEntity<IncidentTicket> getTicketById(@PathVariable String id) {
        try {
            IncidentTicket ticket = ticketService.getTicketById(id);
            return ResponseEntity.ok(ticket);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    // 3. PUT /api/tickets/{id}/status: Allow technicians to update status and add resolution notes. Returns 200 OK.
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateTicketStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> payload) {
        try {
            String statusStr = payload.get("status");
            String resolutionNotes = payload.get("resolutionNotes");

            if (statusStr == null || statusStr.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Status is required"));
            }

            TicketStatus newStatus;
            try {
                newStatus = TicketStatus.valueOf(statusStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid status value provided"));
            }

            IncidentTicket updatedTicket = ticketService.updateTicketStatus(id, newStatus, resolutionNotes);
            return ResponseEntity.ok(updatedTicket);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", e.getMessage()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        }
    }

    // 4. DELETE /api/tickets/{id}: Allow an ADMIN to remove a ticket. Returns 204 No Content.
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTicket(@PathVariable String id) {
        try {
            ticketService.deleteTicket(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
