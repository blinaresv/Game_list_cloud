public Videojuego actualizarVideojuego(Long id, Videojuego datos) {

    Videojuego videojuego = videojuegoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Videojuego no encontrado"));

    videojuego.setTitulo(datos.getTitulo());
    videojuego.setPlataforma(datos.getPlataforma());
    videojuego.setAnio(datos.getAnio());
    videojuego.setEstado(datos.getEstado());

    // 🔥 AQUÍ ESTÁ LA CLAVE
    if (datos.getCategoria() != null && datos.getCategoria().getId() != null) {
        Categoria categoria = new Categoria();
        categoria.setId(datos.getCategoria().getId());
        videojuego.setCategoria(categoria);
    }

    return videojuegoRepository.save(videojuego);
}