package backend.Repository;

import backend.Model.IncidentTicket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IncidentTicketRepository extends MongoRepository<IncidentTicket, String> {
    java.util.List<IncidentTicket> findByUserId(String userId);
}
