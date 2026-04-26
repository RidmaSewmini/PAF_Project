package backend.service;

import backend.Model.Comment;
import backend.Model.IncidentTicket;
import backend.Model.TicketStatus;
import backend.Repository.IncidentTicketRepository;
import backend.Exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class TicketService {

    private final IncidentTicketRepository ticketRepository;

    @Autowired
    public TicketService(IncidentTicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public IncidentTicket createTicket(IncidentTicket ticket) {
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());
        return ticketRepository.save(ticket);
    }

    public IncidentTicket createTicketWithFiles(IncidentTicket ticket, MultipartFile[] files) throws IOException {
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setCreatedAt(LocalDateTime.now());

        List<String> attachmentUrls = new ArrayList<>();

        if (files != null && files.length > 0) {
            if (files.length > 3) {
                throw new IllegalArgumentException("Maximum of 3 files allowed.");
            }

            String uploadDirStr = "uploads/tickets/";
            File uploadDir = new File(uploadDirStr);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String contentType = file.getContentType();
                    if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png"))) {
                        throw new IllegalArgumentException("Only JPEG and PNG images are allowed.");
                    }

                    String originalFilename = file.getOriginalFilename();
                    String extension = "";
                    if (originalFilename != null && originalFilename.contains(".")) {
                        extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                    }
                    String uniqueFilename = UUID.randomUUID().toString() + extension;
                    Path filePath = Paths.get(uploadDirStr + uniqueFilename);
                    Files.write(filePath, file.getBytes());

                    attachmentUrls.add("http://localhost:8080/uploads/tickets/" + uniqueFilename);
                }
            }
        }

        ticket.setAttachmentUrls(attachmentUrls);
        return ticketRepository.save(ticket);
    }

    public IncidentTicket updateTicketStatus(String id, TicketStatus newStatus, String resolutionNotes) {
        IncidentTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        if (ticket.getStatus() == TicketStatus.CLOSED && newStatus == TicketStatus.OPEN) {
            throw new IllegalStateException("A closed ticket cannot be moved back to OPEN.");
        }

        if (newStatus == TicketStatus.RESOLVED) {
            if (resolutionNotes == null || resolutionNotes.trim().isEmpty()) {
                throw new IllegalArgumentException("Resolution notes are required when resolving a ticket.");
            }
            ticket.setResolutionNotes(resolutionNotes);
        }

        ticket.setStatus(newStatus);
        return ticketRepository.save(ticket);
    }

    public IncidentTicket addComment(String ticketId, Comment comment) {
        IncidentTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        if (comment.getCreatedAt() == null) {
            comment.setCreatedAt(LocalDateTime.now());
        }
        
        ticket.addComment(comment);
        return ticketRepository.save(ticket);
    }

    public IncidentTicket assignTechnician(String ticketId, String technicianId) {
        IncidentTicket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + ticketId));

        ticket.setTechnicianId(technicianId);
        ticket.setStatus(TicketStatus.IN_PROGRESS);
        return ticketRepository.save(ticket);
    }

    public java.util.List<IncidentTicket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public java.util.List<IncidentTicket> getTicketsByUserId(String userId) {
        return ticketRepository.findByUserId(userId);
    }

    public IncidentTicket getTicketById(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));
    }

    public void deleteTicket(String id) {
        if (!ticketRepository.existsById(id)) {
            throw new ResourceNotFoundException("Ticket not found with id: " + id);
        }
        ticketRepository.deleteById(id);
    }
}
