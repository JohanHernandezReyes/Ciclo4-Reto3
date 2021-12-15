
package Ciclo4.Reto3.Repository;

import Ciclo4.Reto3.Model.Order;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface IfcOrder extends MongoRepository<Order, Integer>{
  
    //Seleccionar orden con el maximo id
    public Optional <Order> findTopByOrderByIdDesc();
}
