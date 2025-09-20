const express = require("express");
const app = express();
const cors = require("cors");//coneccion a otros servidores
const morgan = require("morgan");


// Middleware
app.use(express.json()); // Para leer JSON en las solicitudes
app.use(cors()); // Permitir solicitudes de otros dominios
app.use(morgan("dev")); // detalles de cada petición

//importamos los módulos de rutas
const ticketRoutes = require("./routes/ticket.routes");
const notificationRoutes = require("./routes/notification.routes");

//rutas bases
app.use("/tickets", ticketRoutes);
app.use("/notifications", notificationRoutes);

// importar y usar error handler
const errorHandler = require("./middlewares/errorHandler");
app.use(errorHandler);

// Mensaje de prueba en la raíz
app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API RESTful!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


//se debe inicializar con run ya que lleva ya la palabra start junto con dev