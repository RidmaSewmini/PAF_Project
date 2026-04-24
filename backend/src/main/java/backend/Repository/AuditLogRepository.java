package backend.Repository;

import backend.Model.AuditLog;
import backend.Repository.AuditLogRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends MongoRepository<AuditLog, String> {
    List<AuditLog> findAllByOrderByTimestampDesc();

    @Query("{ $and: [ " +
            "{ $or: [ " +
            "  { 'adminName': { $regex: ?0, $options: 'i' } }, " +
            "  { 'targetName': { $regex: ?0, $options: 'i' } }, " +
            "  { 'actionType': { $regex: ?0, $options: 'i' } } " +
            "] }, " +
            "{ $or: [ " +
            "  { 'actionType': ?1 }, " +
            "  { ?1: null } " +
            "] } " +
            "] }")
    Page<AuditLog> searchLogs(String search, String actionType, Pageable pageable);
}
