
package Ciclo4.Reto3.Repository;

import Ciclo4.Reto3.Model.User;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface IfcUser extends MongoRepository<User, Integer>{
    
    public Optional <User> findByEmail(String email);
    public Optional <User> findByPassword(String password);
    
    //Seleccionar usuario con el maximo id
    public Optional <User> findTopByOrderByIdDesc();
}
