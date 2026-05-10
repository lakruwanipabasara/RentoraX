package Rentorax.Backend.service;

import Rentorax.Backend.dto.ApiResponse;
import Rentorax.Backend.model.RentalItem;
import Rentorax.Backend.repository.RentalItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RentalItemService {

    private final RentalItemRepository rentalItemRepository;

    public RentalItemService(RentalItemRepository rentalItemRepository) {
        this.rentalItemRepository = rentalItemRepository;
    }

    public ApiResponse addItem(RentalItem item) {

        if (item.getTitle() == null || item.getTitle().isBlank()) {
            return new ApiResponse(false, "Product title is required", null);
        }

        if (item.getDescription() == null || item.getDescription().isBlank()) {
            return new ApiResponse(false, "Product description is required", null);
        }

        if (item.getPrice() <= 0) {
            return new ApiResponse(false, "Price must be greater than 0", null);
        }

        if (item.getDeposit() < 0) {
            return new ApiResponse(false, "Deposit cannot be negative", null);
        }

        RentalItem savedItem = rentalItemRepository.save(item);

        return new ApiResponse(true, "Product added successfully", savedItem);
    }

    public ApiResponse getAllItems() {
        List<RentalItem> items = rentalItemRepository.findAll();
        return new ApiResponse(true, "Products loaded successfully", items);
    }

    public ApiResponse getItemById(String id) {

        RentalItem item = rentalItemRepository.findById(id).orElse(null);

        if (item == null) {
            return new ApiResponse(false, "Product not found", null);
        }

        return new ApiResponse(true, "Product loaded successfully", item);
    }

    public ApiResponse updateItem(String id, RentalItem updatedItem) {

        RentalItem existingItem = rentalItemRepository.findById(id).orElse(null);

        if (existingItem == null) {
            return new ApiResponse(false, "Product not found", null);
        }

        if (updatedItem.getTitle() == null || updatedItem.getTitle().isBlank()) {
            return new ApiResponse(false, "Product title is required", null);
        }

        if (updatedItem.getDescription() == null || updatedItem.getDescription().isBlank()) {
            return new ApiResponse(false, "Product description is required", null);
        }

        if (updatedItem.getPrice() <= 0) {
            return new ApiResponse(false, "Price must be greater than 0", null);
        }

        if (updatedItem.getDeposit() < 0) {
            return new ApiResponse(false, "Deposit cannot be negative", null);
        }

        existingItem.setTitle(updatedItem.getTitle());
        existingItem.setDescription(updatedItem.getDescription());
        existingItem.setPrice(updatedItem.getPrice());
        existingItem.setDeposit(updatedItem.getDeposit());
        existingItem.setRating(updatedItem.getRating());

        if (updatedItem.getImage() != null && !updatedItem.getImage().isBlank()) {
            existingItem.setImage(updatedItem.getImage());
        }

        RentalItem savedItem = rentalItemRepository.save(existingItem);

        return new ApiResponse(true, "Product updated successfully", savedItem);
    }

    public ApiResponse deleteItem(String id) {

        if (!rentalItemRepository.existsById(id)) {
            return new ApiResponse(false, "Product not found", null);
        }

        rentalItemRepository.deleteById(id);

        return new ApiResponse(true, "Product deleted successfully", null);
    }
}