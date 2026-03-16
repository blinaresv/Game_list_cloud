package com.gamelist.gamelist_api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "videojuego")
public class Videojuego {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El titulo es obligatorio")
    private String titulo;

    @NotBlank(message = "La plataforma es obligatoria")
    private String plataforma;

    @Min(value = 1950, message = "El año debe ser mayor a 1950")
    private int anio;

    @ManyToOne
    @JoinColumn(name = "categoria_id")
    @NotNull(message = "La categoria es obligatoria")
    private Categoria categoria;

    public Videojuego() {
    }

    public Long getId() {
        return id;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getPlataforma() {
        return plataforma;
    }

    public int getAnio() {
        return anio;
    }

    public Categoria getCategoria() {
        return categoria;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public void setPlataforma(String plataforma) {
        this.plataforma = plataforma;
    }

    public void setAnio(int anio) {
        this.anio = anio;
    }

    public void setCategoria(Categoria categoria) {
        this.categoria = categoria;
    }
}
