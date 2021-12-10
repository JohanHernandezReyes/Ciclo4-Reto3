
package Ciclo4.Reto3.Repository;

import Ciclo4.Reto3.Model.User;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {
    
    @Autowired
    private IfcUser UsersCRUD; 
    
    public List<User> MostrarUsuarios(){
        return UsersCRUD.findAll();
    }
    
    public Optional<User> BuscarUsuario(int id){
        return UsersCRUD.findById(id);
    }
    
    public Optional<User> BuscarUsuarioEmail(String email){
        return UsersCRUD.findByEmail(email);
    }
    
    public Optional<User> BuscarUsuarioKey(String password){
        return UsersCRUD.findByPassword(password);
    }
    
    public User GuardarUsuario(User U){
        return UsersCRUD.save(U);
    } 
    
    public Optional<User> LastId(){
        return UsersCRUD.findTopByOrderByIdDesc();
    }
    
    public void EliminarUsuario(int id){
        UsersCRUD.deleteById(id);
    }
}
