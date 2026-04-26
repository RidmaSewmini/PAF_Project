package backend.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import com.fasterxml.jackson.annotation.JsonInclude;

@Document(collection = "users")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserModel {

    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String googleId;

    public enum Role {
        USER, ADMIN, TECHNICIAN
    }

    private Role role = Role.USER;

    private String resetToken;
    private java.util.Date tokenExpiry;

    // Profile Image
    private String profileImageUrl = "";
    private String profileImagePublicId = "";

    // Email verification fields
    private boolean isVerified = false;
    private String verificationCode;
    private java.util.Date verificationExpiry;

    public UserModel() {
    }

    public UserModel(String id, String name, String email, String password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public String getGoogleId() {
        return googleId;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public java.util.Date getTokenExpiry() {
        return tokenExpiry;
    }

    public void setTokenExpiry(java.util.Date tokenExpiry) {
        this.tokenExpiry = tokenExpiry;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }

    public java.util.Date getVerificationExpiry() {
        return verificationExpiry;
    }

    public void setVerificationExpiry(java.util.Date verificationExpiry) {
        this.verificationExpiry = verificationExpiry;
    }

    public String getProfileImageUrl() {
        return profileImageUrl != null ? profileImageUrl : "";
    }

    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }

    public String getProfileImagePublicId() {
        return profileImagePublicId != null ? profileImagePublicId : "";
    }

    public void setProfileImagePublicId(String profileImagePublicId) {
        this.profileImagePublicId = profileImagePublicId;
    }
}
