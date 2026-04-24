package backend.Repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import backend.Model.Settings;

@Repository
public interface SettingsRepository extends MongoRepository<Settings, String> {
}
