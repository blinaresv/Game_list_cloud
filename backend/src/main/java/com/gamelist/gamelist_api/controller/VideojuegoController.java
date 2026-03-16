package com.gamelist.gamelist_api.controller;

import com.gamelist.gamelist_api.model.Videojuego;
import com.gamelist.gamelist_api.service.VideojuegoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/videojuegos")
@CrossOrigin(origins = "*")
public class VideojuegoController {

    private final VideojuegoService videojuegoService;

    public VideojuegoController(VideojuegoService videojuegoService) {
        this.videojuegoService = videojuegoService;
    }

    @GetMapping
    public List<Videojuego> listarVideojuegos() {
        return videojuegoService.listarVideojuegos();
    }

    @GetMapping("/{id}")
    public Videojuego obtenerVideojuego(@PathVariable Long id) {
        return videojuegoService.obtenerVideojuegoPorId(id);
    }

    @GetMapping("/categoria/{categoriaId}")
    public List<Videojuego> obtenerPorCategoria(@PathVariable Long categoriaId) {
        return videojuegoService.obtenerVideojuegosPorCategoria(categoriaId);
    }

    @PostMapping
    public Videojuego crearVideojuego(@RequestBody Videojuego videojuego) {
        return videojuegoService.crearVideojuego(videojuego);
    }

    @PutMapping("/{id}")
    public Videojuego actualizarVideojuego(@PathVariable Long id, @RequestBody Videojuego videojuego) {
        return videojuegoService.actualizarVideojuego(id, videojuego);
    }

    @DeleteMapping("/{id}")
    public void eliminarVideojuego(@PathVariable Long id) {
        videojuegoService.eliminarVideojuego(id);
    }
}