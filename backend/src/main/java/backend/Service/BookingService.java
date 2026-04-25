package backend.service;

import backend.Model.BookingModel;
import backend.Repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    // Get all bookings (Admin)
    public List<BookingModel> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Get bookings by user (User sees only their own)
    public List<BookingModel> getBookingsByUser(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    // Get single booking by ID
    public BookingModel getBookingById(String id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    // Create a new booking with conflict check
    public BookingModel createBooking(BookingModel booking) {

        // CONFLICT CHECK — core logic
        List<BookingModel> conflicts = bookingRepository.findConflictingBookings(
                booking.getResourceId(),
                booking.getStartTime(),
                booking.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            throw new RuntimeException(
                "Booking conflict detected! This resource is already booked for the selected time."
            );
        }

        // No conflict — save as PENDING
        booking.setStatus("PENDING");
        return bookingRepository.save(booking);
    }

    // Admin approves a booking
    public BookingModel approveBooking(String id) {
        BookingModel booking = getBookingById(id);

        if (!booking.getStatus().equals("PENDING")) {
            throw new RuntimeException("Only PENDING bookings can be approved.");
        }

        booking.setStatus("APPROVED");
        return bookingRepository.save(booking);
    }

    // Admin rejects a booking with a reason
    public BookingModel rejectBooking(String id, String reason) {
        BookingModel booking = getBookingById(id);

        if (!booking.getStatus().equals("PENDING")) {
            throw new RuntimeException("Only PENDING bookings can be rejected.");
        }

        booking.setStatus("REJECTED");
        booking.setRejectionReason(reason);
        return bookingRepository.save(booking);
    }

    // User cancels their own booking
    public BookingModel cancelBooking(String id) {
        BookingModel booking = getBookingById(id);

        if (!booking.getStatus().equals("APPROVED") && 
            !booking.getStatus().equals("PENDING")) {
            throw new RuntimeException("Only APPROVED or PENDING bookings can be cancelled.");
        }

        booking.setStatus("CANCELLED");
        return bookingRepository.save(booking);
    }

    // Filter bookings by status (Admin)
    public List<BookingModel> getBookingsByStatus(String status) {
        return bookingRepository.findByStatus(status);
    }
}