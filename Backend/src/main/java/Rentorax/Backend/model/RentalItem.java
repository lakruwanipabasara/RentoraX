package Rentorax.Backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "items")
public class RentalItem {

    @Id
    private String id;

    private String title;
    private String description;

    private double price;
    private double deposit;
    private double rating;

    private String image;
}