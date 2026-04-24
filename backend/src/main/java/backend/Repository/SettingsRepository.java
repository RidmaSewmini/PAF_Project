package backend.Repository;

import backend.Model.Settings;
import backend.Repository.SettingsRepository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SettingsRepository extends MongoRepository<Settings, String> {
}
