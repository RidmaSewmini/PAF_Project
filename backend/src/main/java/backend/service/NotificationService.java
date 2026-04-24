package backend.service;

import backend.Model.Notification;
import backend.Repository.NotificationRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(String userId, String message, String type) {
        Notification notification = new Notification(userId, message, type);
        // Explicitly ensuring defaults
        if (notification.getCreatedAt() == null) {
            notification.setCreatedAt(LocalDateTime.now());
        }
        if (notification.getIsRead() == null) {
            notification.setIsRead(false);
        }
        if (notification.getIsSeen() == null) {
            notification.setIsSeen(false);
        }
        return notificationRepository.save(notification);
    }

    public Page<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, PageRequest.of(0, 20));
    }

    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        });
    }

    public void markAsUnread(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setIsRead(false);
            notificationRepository.save(notification);
        });
    }

    public void markAllAsRead(String userId) {
        List<Notification> notifications = notificationRepository.findByUserId(userId);
        notifications.forEach(n -> {
            if (!n.getIsRead()) {
                n.setIsRead(true);
            }
        });
        notificationRepository.saveAll(notifications);
    }

    public void markAllAsSeen(String userId) {
        List<Notification> notifications = notificationRepository.findByUserId(userId);
        boolean changed = false;
        for (Notification n : notifications) {
            if (!n.getIsSeen()) {
                n.setIsSeen(true);
                changed = true;
            }
        }
        if (changed) {
            notificationRepository.saveAll(notifications);
        }
    }
}
