package Rentorax.Backend.controller;

import Rentorax.Backend.dto.ApiResponse;
import Rentorax.Backend.service.NotificationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5174"
})
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/user/{userId}")
    public ApiResponse getUserNotifications(@PathVariable String userId) {
        return notificationService.getUserNotifications(userId);
    }

    @GetMapping("/user/{userId}/unread-count")
    public ApiResponse getUnreadCount(@PathVariable String userId) {
        return notificationService.getUnreadCount(userId);
    }

    @PutMapping("/user/{userId}/read-all")
    public ApiResponse markAllAsRead(@PathVariable String userId) {
        return notificationService.markAllAsRead(userId);
    }
}