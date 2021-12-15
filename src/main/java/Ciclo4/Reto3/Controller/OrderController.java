
package Ciclo4.Reto3.Controller;

import Ciclo4.Reto3.Model.Order;
import Ciclo4.Reto3.Services.OrderServices;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/order")
@CrossOrigin(origins="*", methods={RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class OrderController {
    
    @Autowired
    private OrderServices OrdersServices;
    
    @GetMapping("/all")
    public List<Order> MostrarOrdenes(){
        return OrdersServices.MostrarOrdenes();
    }
    
    @GetMapping("/{id}")
    public Optional<Order> BuscarOrdenId(@PathVariable("id") int id){
        return OrdersServices.BuscarOrdenId(id);
    }
   
    @PostMapping("/new")
    @ResponseStatus(HttpStatus.CREATED)
    public Order GuardarOrden(@RequestBody Order O){
        return OrdersServices.GuardarOrden(O);
    }
        
    @PutMapping("/update")
    @ResponseStatus(HttpStatus.CREATED)
    public Order ActualizarStatusOrden(@RequestBody Order O){
        return OrdersServices.ActualizarStatusOrden(O);
    }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public boolean BorrarOrden(@PathVariable("id") int id){
        return OrdersServices.EliminarOrden(id);
    }
}
