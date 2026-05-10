package Rentorax.Backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import Rentorax.Backend.dto.ApiResponse;
import Rentorax.Backend.model.Booking;
import Rentorax.Backend.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5174"
})
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ApiResponse createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    @GetMapping
    public ApiResponse getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/pending")
    public ApiResponse getPendingBookings() {
        return bookingService.getPendingBookings();
    }

    @GetMapping("/approved")
    public ApiResponse getApprovedBookings() {
        return bookingService.getApprovedBookings();
    }

    @GetMapping("/user/{userId}")
    public ApiResponse getBookingsByUser(@PathVariable String userId) {
        return bookingService.getBookingsByUser(userId);
    }

    @GetMapping("/user/{userId}/active-upcoming")
    public ApiResponse getActiveAndUpcomingBookings(@PathVariable String userId) {
        return bookingService.getActiveAndUpcomingBookings(userId);
    }

    @GetMapping("/user/{userId}/past")
    public ApiResponse getPastBookings(@PathVariable String userId) {
        return bookingService.getPastBookings(userId);
    }

    @PutMapping("/{bookingId}/approve")
    public ApiResponse approveOrder(@PathVariable String bookingId) {
        return bookingService.approveOrder(bookingId);
    }

    @PutMapping("/{bookingId}/reminder")
    public ApiResponse sendReturnReminder(@PathVariable String bookingId) {
        return bookingService.sendReturnReminder(bookingId);
    }

    @PutMapping("/{bookingId}/past")
    public ApiResponse moveToPast(@PathVariable String bookingId) {
        return bookingService.moveToPast(bookingId);
    }

    @DeleteMapping("/{bookingId}")
    public ApiResponse deleteBooking(@PathVariable String bookingId) {
        return bookingService.deleteBooking(bookingId);
    }
}