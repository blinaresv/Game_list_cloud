package com.gamelist.gamelist_api.controller;

import com.gamelist.gamelist_api.model.Videojuego;
import com.gamelist.gamelist_api.service.VideojuegoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/videojuegos")
@CrossOrigin
public class VideojuegoController {

    private final VideojuegoService videojuegoService;

    public VideojuegoController(VideojuegoService videojuegoService) {
        this.videojuegoService = videojuegoService;
    }

    @GetMapping
    public List<Videojuego> listar() {
        return videojuegoService.listarVideojuegos();
    }

    @PostMapping
    public Videojuego crear(@RequestBody Videojuego videojuego) {
        return videojuegoService.crearVideojuego(videojuego);
    }

    @PutMapping("/{id}")
    public Videojuego actualizar(@PathVariable Long id, @RequestBody Videojuego videojuego) {
        return videojuegoService.actualizarVideojuego(id, videojuego);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        videojuegoService.eliminarVideojuego(id);
    }
}