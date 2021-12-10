
package Ciclo4.Reto3.Model;

import java.util.Date;
import java.util.Map;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection="orders")
public class Order {

    public static String PENDING = "Pendiente";
    public static String APROVED = "Aprobada";
    public static String REJECTED = "Rechazada";

    @Id
    private Integer id;

    private Date registerDay;
    private String status;
    private User salesMan;
    private Map<String, Cookware> products;
    private Map<String, Integer> quantities;
    
}