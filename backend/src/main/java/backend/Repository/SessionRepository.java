package backend.Repository;

import backend.Model.Session;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessionRepository extends MongoRepository<Session, String> {
    List<Session> findByUserIdAndIsActiveTrueOrderByLoginTimeDesc(String userId);
    Optional<Session> findByIdAndUserId(String id, String userId);
}
