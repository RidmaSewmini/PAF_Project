package backend.service;

import backend.Model.BookingModel;
import backend.Model.FacilityModel;
import backend.Model.UserModel;
import backend.Repository.BookingRepository;
import backend.Repository.FacilityRepository;
import backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private NotificationService notificationService;

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

        // Fetch facility name and store it on the booking
        String facilityName = booking.getResourceId();
        try {
            FacilityModel facility = facilityRepository.findById(booking.getResourceId()).orElse(null);
            if (facility != null) {
                facilityName = facility.getName();
                booking.setResourceName(facilityName);
            }
        } catch (Exception ignored) {}

        // No conflict — save as PENDING
        booking.setStatus("PENDING");
        BookingModel saved = bookingRepository.save(booking);

        // Notify all admins about new booking request
        List<UserModel> admins = userRepository.findByRole(UserModel.Role.ADMIN);
        for (UserModel admin : admins) {
            notificationService.createNotification(
                admin.getId(),
                "New booking request for \"" + facilityName + "\" is pending your approval.",
                "BOOKING_REQUEST"
            );
        }

        return saved;
    }

    // Admin approves a booking
    public BookingModel approveBooking(String id) {
        BookingModel booking = getBookingById(id);

        if (!booking.getStatus().equals("PENDING")) {
            throw new RuntimeException("Only PENDING bookings can be approved.");
        }

        // Defensive conflict check at approval time: ensure no other APPROVED booking overlaps
        List<BookingModel> conflicts = bookingRepository.findConflictingApprovedBookingsExcludingId(
                booking.getResourceId(), booking.getStartTime(), booking.getEndTime(), booking.getId()
        );

        if (!conflicts.isEmpty()) {
            throw new RuntimeException(
                    "Cannot approve booking — conflicts with existing approved booking for the selected time."
            );
        }

        booking.setStatus("APPROVED");
        BookingModel saved = bookingRepository.save(booking);

        // Use facility name if available, fall back to resourceId
        String facilityName = booking.getResourceName() != null
                ? booking.getResourceName()
                : booking.getResourceId();

        notificationService.createNotification(
            booking.getUserId(),
            "Your booking for \"" + facilityName + "\" has been approved!",
            "BOOKING_APPROVED"
        );

        return saved;
    }

    // Admin rejects a booking with a reason
    public BookingModel rejectBooking(String id, String reason) {
        BookingModel booking = getBookingById(id);

        if (!booking.getStatus().equals("PENDING")) {
            throw new RuntimeException("Only PENDING bookings can be rejected.");
        }

        booking.setStatus("REJECTED");
        booking.setRejectionReason(reason);
        BookingModel saved = bookingRepository.save(booking);

        // Use facility name if available, fall back to resourceId
        String facilityName = booking.getResourceName() != null
                ? booking.getResourceName()
                : booking.getResourceId();

        notificationService.createNotification(
            booking.getUserId(),
            "Your booking for \"" + facilityName + "\" has been rejected. Reason: " + reason,
            "BOOKING_REJECTED"
        );

        return saved;
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