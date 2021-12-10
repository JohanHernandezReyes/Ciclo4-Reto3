package Ciclo4.Reto3.Services;

import Ciclo4.Reto3.Model.Cookware;
import Ciclo4.Reto3.Repository.CookwareRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CookwareServices {
    
    @Autowired
    private CookwareRepository ProductoRepository;
    
 
    public List <Cookware> MostrarProductos(){
        return (List<Cookware>) ProductoRepository.MostrarProductos();
    }    
    
    public Optional<Cookware> BuscarProducto(String id){
        return ProductoRepository.BuscarProducto(id);
    }
    

    public Cookware GuardarProducto(Cookware P){
        if (P.getReference()==null){
            return ProductoRepository.GuardarProducto(P);
        }else{
            Optional<Cookware> ProductoX=ProductoRepository.BuscarProducto(P.getReference());
            if(!ProductoX.isPresent()){
                return ProductoRepository.GuardarProducto(P);
            } else {
                return P;
            }     
        }
    }
 
    public Cookware ActualizarProducto(Cookware P) {
        if (P.getReference() != null) {
            Optional<Cookware> ProductoX = ProductoRepository.BuscarProducto(P.getReference());
            if (ProductoX.isPresent()) {
                if (P.getDescription() != null && P.getCategory() != null) {
                    ProductoX.get().setReference(P.getReference());
                    ProductoX.get().setBrand(P.getBrand());
                    ProductoX.get().setCategory(P.getCategory());
                    ProductoX.get().setMateriales(P.getMateriales());
                    ProductoX.get().setDimensiones(P.getDimensiones());
                    ProductoX.get().setDescription(P.getDescription());
                    ProductoX.get().setAvailability(P.isAvailability());
                    ProductoX.get().setQuantity(P.getQuantity());
                    ProductoX.get().setPrice(P.getPrice());
                    ProductoX.get().setPhotography(P.getPhotography());

                }
                return ProductoRepository.GuardarProducto(ProductoX.get());
            }
        }
        return P;
    }

    public boolean EliminarProducto(String id) {
        Optional<Cookware> ProductoX = BuscarProducto(id);
        if (ProductoX.isPresent()) {
            ProductoRepository.EliminarProducto(id);
            return true;
        }
        return false;
    }
}
