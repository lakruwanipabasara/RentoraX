package Rentorax.Backend.repository;

import Rentorax.Backend.model.RentalItem;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RentalItemRepository extends MongoRepository<RentalItem, String> {
}