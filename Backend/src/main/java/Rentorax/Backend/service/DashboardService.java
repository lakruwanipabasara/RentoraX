 package Rentorax.Backend.service;

import Rentorax.Backend.dto.ApiResponse;
import Rentorax.Backend.model.Booking;
import Rentorax.Backend.model.RentalItem;
import Rentorax.Backend.repository.BookingRepository;
import Rentorax.Backend.repository.RentalItemRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final RentalItemRepository rentalItemRepository;
    private final BookingRepository bookingRepository;

    public DashboardService(
            RentalItemRepository rentalItemRepository,
            BookingRepository bookingRepository
    ) {
        this.rentalItemRepository = rentalItemRepository;
        this.bookingRepository = bookingRepository;
    }

    public ApiResponse getOverview() {

        List<RentalItem> items = rentalItemRepository.findAll();
        List<Booking> bookings = bookingRepository.findAll();

        double totalRevenue = bookings.stream()
                .mapToDouble(Booking::getTotal)
                .sum();

        long activeRentals = bookings.stream()
                .filter(booking ->
                        booking.getStatus() != null &&
                                booking.getStatus().equalsIgnoreCase("Active")
                )
                .count();

        long pendingRequests = bookings.stream()
                .filter(booking ->
                        booking.getStatus() != null &&
                                booking.getStatus().equalsIgnoreCase("Upcoming")
                )
                .count();

        Map<String, Object> overview = new HashMap<>();

        overview.put("monthlyRevenue", totalRevenue);
        overview.put("activeRentals", activeRentals);
        overview.put("pendingApproval", pendingRequests);
        overview.put("totalItems", items.size());

        return new ApiResponse(true, "Dashboard overview loaded successfully", overview);
    }

    public ApiResponse getInventory() {
        List<RentalItem> items = rentalItemRepository.findAll();
        return new ApiResponse(true, "Inventory loaded successfully", items);
    }

    public ApiResponse getRecentTransactions() {
        List<Booking> bookings = bookingRepository.findAll();
        return new ApiResponse(true, "Recent transactions loaded successfully", bookings);
    }

    public ApiResponse getEarningsChart(int days) {

        List<Booking> bookings = bookingRepository.findAll();

        LocalDate startDate = LocalDate.now().minusDays(days - 1);

        List<Booking> filteredBookings = bookings.stream()
                .filter(booking -> booking.getCreatedAt() != null)
                .filter(booking -> !booking.getCreatedAt().toLocalDate().isBefore(startDate))
                .toList();

        double netRevenue = filteredBookings.stream()
                .mapToDouble(Booking::getTotal)
                .sum();

        List<Map<String, Object>> chartData = new ArrayList<>();

        if (days == 7) {

            for (int i = days - 1; i >= 0; i--) {

                LocalDate date = LocalDate.now().minusDays(i);

                double dailyIncome = filteredBookings.stream()
                        .filter(booking -> booking.getCreatedAt().toLocalDate().equals(date))
                        .mapToDouble(Booking::getTotal)
                        .sum();

                Map<String, Object> data = new HashMap<>();

                data.put("name", date.getDayOfWeek().toString().substring(0, 3));
                data.put("income", dailyIncome);

                chartData.add(data);
            }

        } else if (days == 30) {

            for (int week = 1; week <= 5; week++) {

                LocalDate weekStart = startDate.plusDays((week - 1) * 7);
                LocalDate weekEnd = weekStart.plusDays(6);

                if (weekEnd.isAfter(LocalDate.now())) {
                    weekEnd = LocalDate.now();
                }

                LocalDate finalWeekStart = weekStart;
                LocalDate finalWeekEnd = weekEnd;

                double weeklyIncome = filteredBookings.stream()
                        .filter(booking -> {
                            LocalDate bookingDate = booking.getCreatedAt().toLocalDate();

                            return !bookingDate.isBefore(finalWeekStart)
                                    && !bookingDate.isAfter(finalWeekEnd);
                        })
                        .mapToDouble(Booking::getTotal)
                        .sum();

                Map<String, Object> data = new HashMap<>();

                data.put("name", "Week " + week);
                data.put("income", weeklyIncome);

                chartData.add(data);
            }

        } else {

            for (int i = days - 1; i >= 0; i--) {

                LocalDate date = LocalDate.now().minusDays(i);

                double dailyIncome = filteredBookings.stream()
                        .filter(booking -> booking.getCreatedAt().toLocalDate().equals(date))
                        .mapToDouble(Booking::getTotal)
                        .sum();

                Map<String, Object> data = new HashMap<>();

                data.put("name", String.valueOf(date.getDayOfMonth()));
                data.put("income", dailyIncome);

                chartData.add(data);
            }
        }

        Map<String, Object> chart = new HashMap<>();

        chart.put("netRevenue", netRevenue);
        chart.put("chartData", chartData);

        return new ApiResponse(true, "Earnings chart loaded successfully", chart);
    }
}