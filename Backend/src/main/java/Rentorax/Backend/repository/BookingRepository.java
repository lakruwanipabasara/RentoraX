package Rentorax.Backend.repository;

import Rentorax.Backend.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByUserId(String userId);

    List<Booking> findByUserIdAndStatusIgnoreCase(String userId, String status);

    List<Booking> findByUserIdAndStatusIn(String userId, List<String> statuses);

    List<Booking> findByStatusIgnoreCase(String status);
}