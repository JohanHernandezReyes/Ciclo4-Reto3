
package Ciclo4.Reto3.Services;

import Ciclo4.Reto3.Model.User;
import Ciclo4.Reto3.Repository.UserRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServices {
    
    @Autowired
    private UserRepository UsersRepository;
    
 
    public List <User> MostrarUsers(){
        return (List<User>) UsersRepository.MostrarUsuarios();
    }    
    
    public Optional<User> BuscarUserId(int id){
        return UsersRepository.BuscarUsuario(id);
    }
       
    public boolean BuscarUser(String email){
        Optional<User> UserX=UsersRepository.BuscarUsuarioEmail(email);
         if(UserX.isPresent()){
            return true;
        }
        return false;  
    }
    
    
    public Optional<User> BuscarUserKey (String email, String password){
        Optional<User> UserX=UsersRepository.BuscarUsuarioEmail(email);
        Optional<User> UserY=UsersRepository.BuscarUsuarioKey(password);
        User UserZ=new User();
        if(UserX.isPresent() && UserX.equals(UserY)){
            return UserX;
        }
        return Optional.of(UserZ);  
    }

    public User GuardarUser(User U){
        
        Optional <User> NextUser = UsersRepository.LastId(); 
        if (U.getId()==null){
            if(!NextUser.isPresent()){
                U.setId(1);
            }
            else{
                U.setId(NextUser.get().getId() + 1);
            }      
        }   
        
        Optional<User> UserX=UsersRepository.BuscarUsuarioEmail(U.getEmail());
        if(!UserX.isPresent()){
                return UsersRepository.GuardarUsuario(U);
        } else {
            return U;
        }     
    }
    
 
    public User ActualizarUser(User U) {
        if (U.getId() != null) {
            Optional<User> UserX = UsersRepository.BuscarUsuario(U.getId());
            if (UserX.isPresent()) {
                if (U.getPassword() != null && U.getIdentification() != null && U.getEmail() != null) {
                    UserX.get().setId(U.getId());
                    UserX.get().setIdentification(U.getIdentification());
                    UserX.get().setName(U.getName());
                    UserX.get().setBirthtDay(U.getBirthtDay());
                    UserX.get().setMonthBirthtDay(U.getMonthBirthtDay());
                    UserX.get().setAddress(U.getAddress());
                    UserX.get().setCellPhone(U.getCellPhone());
                    UserX.get().setEmail(U.getEmail());
                    UserX.get().setPassword(U.getPassword());
                    UserX.get().setZone(U.getZone());
                    UserX.get().setType(U.getType());
                }
                return UsersRepository.GuardarUsuario(UserX.get());
            }
        }
        return U;
    }

    public boolean EliminarUser(int id) {
        Optional<User> UserX = BuscarUserId(id);
        if (UserX.isPresent()) {
            UsersRepository.EliminarUsuario(id);
            return true;
        }
        return false;
    }   
}