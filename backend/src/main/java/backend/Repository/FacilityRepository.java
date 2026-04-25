package backend.Repository;

import backend.Model.FacilityModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FacilityRepository extends MongoRepository<FacilityModel, String> {

    List<FacilityModel> findByType(String type);
    List<FacilityModel> findByLocation(String location);
    List<FacilityModel> findByStatus(String status);
    List<FacilityModel> findByCapacityGreaterThanEqual(int capacity);
    List<FacilityModel> findByTypeAndLocation(String type, String location);
}