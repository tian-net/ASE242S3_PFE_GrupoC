package pe.edu.vallegrande.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.edu.vallegrande.model.Cliente;
import pe.edu.vallegrande.service.ClienteService;

import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = "*") // para permitir Angular
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @GetMapping
    public List<Cliente> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtener(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Cliente crear(@RequestBody Cliente cliente) {
        return service.guardar(cliente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> actualizar(@PathVariable Long id, @RequestBody Cliente cliente) {
        return service.buscarPorId(id)
                .map(c -> {
                    c.setNombre(cliente.getNombre());
                    c.setCorreo(cliente.getCorreo());
                    c.setTelefono(cliente.getTelefono());
                    return ResponseEntity.ok(service.guardar(c));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (service.buscarPorId(id).isPresent()) {
            service.eliminar(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
