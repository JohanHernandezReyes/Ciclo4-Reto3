
package Ciclo4.Reto3.Repository;

import Ciclo4.Reto3.Model.Order;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface IfcOrder extends MongoRepository<Order, Integer>{
    
    @Query("{'salesMan.zone':?0}")
    public List <Order> findByZone(String zone);
    
    @Query("{status:?0}")
    public List <Order> findByStatus(String status);
    
    //Seleccionar orden con el maximo id
    public Optional <Order> findTopByOrderByIdDesc();
}
