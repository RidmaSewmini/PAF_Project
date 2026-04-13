package backend.Controller;

import backend.Model.BookingModel;
import backend.Service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // GET all bookings (Admin)
    @GetMapping
    public ResponseEntity<List<BookingModel>> getAllBookings(
            @RequestParam(required = false) String status) {
        if (status != null) {
            return ResponseEntity.ok(bookingService.getBookingsByStatus(status));
        }
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // GET bookings by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingModel>> getBookingsByUser(
            @PathVariable String userId) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(userId));
    }

    // GET single booking
    @GetMapping("/{id}")
    public ResponseEntity<BookingModel> getBookingById(@PathVariable String id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    // POST create booking
    @PostMapping
    public ResponseEntity<?> createBooking(
            @Valid @RequestBody BookingModel booking) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(bookingService.createBooking(booking));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // PUT approve booking (Admin)
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveBooking(@PathVariable String id) {
        try {
            return ResponseEntity.ok(bookingService.approveBooking(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // PUT reject booking (Admin)
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectBooking(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        try {
            String reason = body.get("reason");
            return ResponseEntity.ok(bookingService.rejectBooking(id, reason));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // PUT cancel booking (User)
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable String id) {
        try {
            return ResponseEntity.ok(bookingService.cancelBooking(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}