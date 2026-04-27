package backend.Repository;

import backend.Model.BookingModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<BookingModel, String> {

    // Find all bookings by a specific user
    List<BookingModel> findByUserId(String userId);

    // Find all bookings for a specific resource
    List<BookingModel> findByResourceId(String resourceId);

    // Find all bookings by status
    List<BookingModel> findByStatus(String status);

    // Find bookings by user and status
    List<BookingModel> findByUserIdAndStatus(String userId, String status);

    // THIS IS THE CONFLICT CHECK QUERY (creation-time)
    // Finds any APPROVED or PENDING bookings for the same resource that overlap with the requested time
    @Query("{ 'resourceId': ?0, 'status': { $in: ['APPROVED','PENDING'] }, $or: [ { 'startTime': { $lt: ?2 }, 'endTime': { $gt: ?1 } } ] }")
    List<BookingModel> findConflictingBookings(String resourceId, 
                                               LocalDateTime startTime, 
                                               LocalDateTime endTime);

    // Approval-time check: find any EXISTING APPROVED bookings (excluding the booking being approved)
    @Query("{ 'resourceId': ?0, 'status': 'APPROVED', '_id': { $ne: ?3 }, $or: [ { 'startTime': { $lt: ?2 }, 'endTime': { $gt: ?1 } } ] }")
    List<BookingModel> findConflictingApprovedBookingsExcludingId(String resourceId,
                                                                 LocalDateTime startTime,
                                                                 LocalDateTime endTime,
                                                                 String excludeId);
}