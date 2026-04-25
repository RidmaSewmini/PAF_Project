package backend.service;

import backend.Model.Comment;
import backend.Model.IncidentTicket;
import backend.Model.TicketStatus;
import backend.Repository.IncidentTicketRepository;
import backend.Exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

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
}
