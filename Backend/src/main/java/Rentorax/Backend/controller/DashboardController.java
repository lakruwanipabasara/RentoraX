package Rentorax.Backend.controller;

import Rentorax.Backend.dto.ApiResponse;
import Rentorax.Backend.service.DashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5174"
})
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/overview")
    public ApiResponse getOverview() {
        return dashboardService.getOverview();
    }

    @GetMapping("/inventory")
    public ApiResponse getInventory() {
        return dashboardService.getInventory();
    }

    @GetMapping("/transactions")
    public ApiResponse getRecentTransactions() {
        return dashboardService.getRecentTransactions();
    }

    @GetMapping("/earnings")
    public ApiResponse getEarningsChart(@RequestParam(defaultValue = "7") int days) {
        return dashboardService.getEarningsChart(days);
    }
}