package Rentorax.Backend.controller;

import Rentorax.Backend.dto.ApiResponse;
import Rentorax.Backend.model.RentalItem;
import Rentorax.Backend.service.RentalItemService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "http://localhost:5174"
})
public class RentalItemController {

    private final RentalItemService rentalItemService;

    public RentalItemController(RentalItemService rentalItemService) {
        this.rentalItemService = rentalItemService;
    }

    @PostMapping
    public ApiResponse addItem(@RequestBody RentalItem item) {
        return rentalItemService.addItem(item);
    }

    @GetMapping
    public ApiResponse getAllItems() {
        return rentalItemService.getAllItems();
    }

    @GetMapping("/{id}")
    public ApiResponse getItemById(@PathVariable String id) {
        return rentalItemService.getItemById(id);
    }

    @PutMapping("/{id}")
    public ApiResponse updateItem(
            @PathVariable String id,
            @RequestBody RentalItem item
    ) {
        return rentalItemService.updateItem(id, item);
    }

    @DeleteMapping("/{id}")
    public ApiResponse deleteItem(@PathVariable String id) {
        return rentalItemService.deleteItem(id);
    }
}