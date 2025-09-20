function errorHandler(err, req, res, next) {
  console.error(err); // log en consola

  const status = err.status || 500;

  res.status(status).json({
    success: false,
    error: {
      code: status,
      message: err.message || "Error interno del servidor",
      hint: status === 404 
        ? "Verifica que el id sea correcto o crea un nuevo ticket antes de eliminarlo"
        : "Si el problema persiste, contacte al administrador"
    }
  });
}

module.exports = errorHandler;
