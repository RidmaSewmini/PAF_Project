package backend.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "sessions")
public class Session {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String deviceInfo;
    private String userAgentRaw;
    private String ipAddress;
    private LocalDateTime loginTime;
    private LocalDateTime lastActive;
    private boolean isActive;

    public Session() {
    }

    public Session(String userId, String deviceInfo, String userAgentRaw, String ipAddress, LocalDateTime loginTime, LocalDateTime lastActive, boolean isActive) {
        this.userId = userId;
        this.deviceInfo = deviceInfo;
        this.userAgentRaw = userAgentRaw;
        this.ipAddress = ipAddress;
        this.loginTime = loginTime;
        this.lastActive = lastActive;
        this.isActive = isActive;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getDeviceInfo() {
        return deviceInfo;
    }

    public void setDeviceInfo(String deviceInfo) {
        this.deviceInfo = deviceInfo;
    }

    public String getUserAgentRaw() {
        return userAgentRaw;
    }

    public void setUserAgentRaw(String userAgentRaw) {
        this.userAgentRaw = userAgentRaw;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public LocalDateTime getLoginTime() {
        return loginTime;
    }

    public void setLoginTime(LocalDateTime loginTime) {
        this.loginTime = loginTime;
    }

    public LocalDateTime getLastActive() {
        return lastActive;
    }

    public void setLastActive(LocalDateTime lastActive) {
        this.lastActive = lastActive;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }
}
