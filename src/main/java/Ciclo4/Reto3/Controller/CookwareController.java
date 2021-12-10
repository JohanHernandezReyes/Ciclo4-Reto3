
package Ciclo4.Reto3.Controller;

import Ciclo4.Reto3.Model.Cookware;
import Ciclo4.Reto3.Services.CookwareServices;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/cookware")
@CrossOrigin(origins="*", methods={RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class CookwareController {
    
    @Autowired
    private CookwareServices ProductosServ;
    
    @GetMapping("/all")
    public List<Cookware> MostrarProductos(){
        return ProductosServ.MostrarProductos();
    }
    
    @GetMapping("/{reference}")
    public Optional<Cookware> BuscarUserId(@PathVariable("reference") String ref){
        return ProductosServ.BuscarProducto(ref);
    }
    
    @PostMapping("/new")
    @ResponseStatus(HttpStatus.CREATED)
    public Cookware GuardarProducto(@RequestBody Cookware P){
        return ProductosServ.GuardarProducto(P);
    }
        
    @PutMapping("/update")
    @ResponseStatus(HttpStatus.CREATED)
    public Cookware ActualizarProducto(@RequestBody Cookware P){
        return ProductosServ.ActualizarProducto(P);
    }
    
    @DeleteMapping("/{reference}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public boolean BorrarProducto(@PathVariable("reference") String id){
        return ProductosServ.EliminarProducto(id);
    }
}