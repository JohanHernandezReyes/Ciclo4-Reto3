
package Ciclo4.Reto3.Controller;

import Ciclo4.Reto3.Model.User;
import Ciclo4.Reto3.Services.UserServices;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/user")
@CrossOrigin(origins="*", methods={RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class UserController {
    
    @Autowired
    private UserServices UsersServices;
    
    @GetMapping("/all")
    public List<User> MostrarUsers(){
        return UsersServices.MostrarUsers();
    }
    
    @GetMapping("/emailexist/{email}")
    public boolean BuscarUser(@PathVariable("email") String email){
        return UsersServices.BuscarUser(email);
    }
    
    @GetMapping("/{id}")
    public Optional<User> BuscarUserId(@PathVariable("id") int id){
        return UsersServices.BuscarUserId(id);
    }
    
    @GetMapping("/{email}/{password}")
    public Optional<User> BuscarUserKey(@PathVariable("email") String email, @PathVariable("password") String password){
        return UsersServices.BuscarUserKey(email, password);
    }
   
    @PostMapping("/new")
    @ResponseStatus(HttpStatus.CREATED)
    public User GuardarUser(@RequestBody User U){
        return UsersServices.GuardarUser(U);
    }
        
    @PutMapping("/update")
    @ResponseStatus(HttpStatus.CREATED)
    public User ActualizarUser(@RequestBody User U){
        return UsersServices.ActualizarUser(U);
    }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public boolean BorrarUser(@PathVariable("id") int id){
        return UsersServices.EliminarUser(id);
    }
}