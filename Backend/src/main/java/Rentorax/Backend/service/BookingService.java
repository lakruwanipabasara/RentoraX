package Rentorax.Backend.service;

import Rentorax.Backend.dto.ApiResponse;
import Rentorax.Backend.model.Booking;
import Rentorax.Backend.model.Notification;
import Rentorax.Backend.model.RentalItem;
import Rentorax.Backend.model.User;
import Rentorax.Backend.repository.BookingRepository;
import Rentorax.Backend.repository.NotificationRepository;
import Rentorax.Backend.repository.RentalItemRepository;
import Rentorax.Backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RentalItemRepository rentalItemRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    public BookingService(
            BookingRepository bookingRepository,
            RentalItemRepository rentalItemRepository,
            UserRepository userRepository,
            NotificationRepository notificationRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.rentalItemRepository = rentalItemRepository;
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }

    public ApiResponse createBooking(Booking booking) {

        if (booking.getUserId() == null || booking.getUserId().isBlank()) {
            return new ApiResponse(false, "User ID is required", null);
        }

        User customer = userRepository.findById(booking.getUserId()).orElse(null);

        if (customer != null) {
            booking.setCustomerName(customer.getName());
            booking.setCustomerEmail(customer.getEmail());
            booking.setCustomerPhone(customer.getPhone());
        } else {
            return new ApiResponse(false, "Customer not found", null);
        }

        if (booking.getItemId() != null && !booking.getItemId().isBlank()) {
            RentalItem item = rentalItemRepository.findById(booking.getItemId()).orElse(null);

            if (item != null) {
                booking.setTitle(item.getTitle());
                booking.setImage(item.getImage());
                booking.setDeposit(item.getDeposit());
            }
        }

        booking.setStatus("Pending");

        if (booking.getProtection() == null || booking.getProtection().isBlank()) {
            booking.setProtection("Included");
        }

        if (booking.getDateRange() == null || booking.getDateRange().isBlank()) {
            booking.setDateRange(booking.getPeriod());
        }

        if (booking.getPeriod() == null || booking.getPeriod().isBlank()) {
            booking.setPeriod(booking.getDateRange());
        }

        if (booking.getCreatedAt() == null) {
            booking.setCreatedAt(LocalDateTime.now());
        }

        Booking savedBooking = bookingRepository.save(booking);

        createNotification(
                "admin",
                "New Rent Request",
                booking.getCustomerName() + " requested to rent " + booking.getTitle() + ". Please approve or check details.",
                "RENT_REQUEST",
                savedBooking.getId()
        );

        createNotification(
                booking.getUserId(),
                "Request Sent",
                "Your rent request for " + booking.getTitle() + " was sent to admin.",
                "REQUEST_SENT",
                savedBooking.getId()
        );

        return new ApiResponse(true, "Rent request sent to admin", savedBooking);
    }

    public ApiResponse getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return new ApiResponse(true, "Bookings loaded successfully", bookings);
    }

    public ApiResponse getPendingBookings() {
        List<Booking> bookings = bookingRepository.findByStatusIgnoreCase("Pending");
        return new ApiResponse(true, "Pending bookings loaded successfully", bookings);
    }

    public ApiResponse getApprovedBookings() {
        List<Booking> bookings = bookingRepository.findByStatusIgnoreCase("Active");
        return new ApiResponse(true, "Approved orders loaded successfully", bookings);
    }

    public ApiResponse getBookingsByUser(String userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        return new ApiResponse(true, "User bookings loaded successfully", bookings);
    }

    public ApiResponse getActiveAndUpcomingBookings(String userId) {
        List<Booking> bookings = bookingRepository.findByUserIdAndStatusIn(
                userId,
                List.of("Pending", "Active")
        );

        return new ApiResponse(true, "Customer bookings loaded successfully", bookings);
    }

    public ApiResponse getPastBookings(String userId) {
        List<Booking> bookings = bookingRepository.findByUserIdAndStatusIgnoreCase(userId, "Past");
        return new ApiResponse(true, "Past bookings loaded successfully", bookings);
    }

    public ApiResponse approveOrder(String bookingId) {

        Booking booking = bookingRepository.findById(bookingId).orElse(null);

        if (booking == null) {
            return new ApiResponse(false, "Booking not found", null);
        }

        booking.setStatus("Active");

        Booking updatedBooking = bookingRepository.save(booking);

        createNotification(
                booking.getUserId(),
                "Order Confirmed",
                "Admin approved your rent request for " + booking.getTitle() + ". Your rental is now active.",
                "ORDER_CONFIRMED",
                booking.getId()
        );

        createNotification(
                "admin",
                "Order Approved",
                "You approved " + booking.getCustomerName() + "'s rent request for " + booking.getTitle() + ".",
                "APPROVED",
                booking.getId()
        );

        return new ApiResponse(true, "Order approved successfully", updatedBooking);
    }

    public ApiResponse sendReturnReminder(String bookingId) {

        Booking booking = bookingRepository.findById(bookingId).orElse(null);

        if (booking == null) {
            return new ApiResponse(false, "Booking not found", null);
        }

        createNotification(
                booking.getUserId(),
                "Return Reminder",
                "You have 1 day left to return " + booking.getTitle() + ". Please return it on time.",
                "RETURN_REMINDER",
                booking.getId()
        );

        return new ApiResponse(true, "One-day return reminder sent to customer", booking);
    }

    public ApiResponse moveToPast(String bookingId) {

        Booking booking = bookingRepository.findById(bookingId).orElse(null);

        if (booking == null) {
            return new ApiResponse(false, "Booking not found", null);
        }

        booking.setStatus("Past");

        Booking updatedBooking = bookingRepository.save(booking);

        createNotification(
                booking.getUserId(),
                "Rental Completed",
                "Your rental for " + booking.getTitle() + " was completed and moved to Past Rentals.",
                "PAST_RENTAL",
                booking.getId()
        );

        return new ApiResponse(true, "Rental moved to past rentals", updatedBooking);
    }

    public ApiResponse deleteBooking(String bookingId) {

        if (!bookingRepository.existsById(bookingId)) {
            return new ApiResponse(false, "Booking not found", null);
        }

        bookingRepository.deleteById(bookingId);

        return new ApiResponse(true, "Booking deleted successfully", null);
    }

    private void createNotification(
            String userId,
            String title,
            String message,
            String type,
            String bookingId
    ) {
        Notification notification = new Notification();

        notification.setUserId(userId);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setType(type);
        notification.setBookingId(bookingId);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        notificationRepository.save(notification);
    }
}