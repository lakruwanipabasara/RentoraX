package Rentorax.Backend.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    private String userId;

    private String customerName;
    private String customerEmail;
    private String customerPhone;

    private String itemId;
    private String title;
    private String status;

    private String period;
    private String dateRange;

    private int duration;

    private double total;
    private double deposit;

    private String protection;
    private String image;

    private boolean returnSoon;
    private int daysRemaining;

    private LocalDateTime createdAt;
}