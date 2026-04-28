package backend.Repository;

import backend.Model.UserModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<UserModel, String> {
    Optional<UserModel> findAllByEmail(String email);
    Optional<UserModel> findByGoogleId(String googleId);
    Optional<UserModel> findByResetToken(String resetToken);
    List<UserModel> findByRole(UserModel.Role role);
}