package Rentorax.Backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;
    private String email;
    private String phone;

    private String addressLine1;
    private String addressLine2;
    private String addressLine3;

    private String password;

    private String profileImage;

    private String role;
}