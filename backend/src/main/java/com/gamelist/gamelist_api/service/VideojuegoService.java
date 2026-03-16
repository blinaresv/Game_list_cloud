package com.gamelist.gamelist_api.service;

import com.gamelist.gamelist_api.model.Videojuego;
import com.gamelist.gamelist_api.repository.VideojuegoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VideojuegoService {

    private final VideojuegoRepository videojuegoRepository;

    public VideojuegoService(VideojuegoRepository videojuegoRepository) {
        this.videojuegoRepository = videojuegoRepository;
    }

    public List<Videojuego> listarVideojuegos() {
        return videojuegoRepository.findAll();
    }

    public Videojuego obtenerVideojuegoPorId(Long id) {
        return videojuegoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Videojuego no encontrado"));
    }

    public List<Videojuego> obtenerVideojuegosPorCategoria(Long categoriaId) {
        return videojuegoRepository.findByCategoriaId(categoriaId);
    }

    public Videojuego crearVideojuego(Videojuego videojuego) {
        return videojuegoRepository.save(videojuego);
    }

    public Videojuego actualizarVideojuego(Long id, Videojuego videojuego) {

        Videojuego existente = videojuegoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Videojuego no encontrado"));

        existente.setTitulo(videojuego.getTitulo());
        existente.setPlataforma(videojuego.getPlataforma());
        existente.setAnio(videojuego.getAnio());
        existente.setCategoria(videojuego.getCategoria());

        return videojuegoRepository.save(existente);
    }

    public void eliminarVideojuego(Long id) {
        videojuegoRepository.deleteById(id);
    }
}
