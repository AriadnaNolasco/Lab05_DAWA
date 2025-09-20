const TicketService = require("../services/TicketService");
const NotificationService = require("../services/NotificationService");
const service = new TicketService();
const notificationService = new NotificationService();

exports.create = (req, res, next) => {
  try {
    const ticket = service.createTicket(req.body);
    res.status(201).json(ticket);
  } catch (err) {
    next(err);
  }
};

exports.list = (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = service.list(page, limit);
    // si devolvemos un objeto con meta -> paginado, si no -> array
    if (result && result.meta) {
      res.status(200).json(result);
    } else {
      res.status(200).json({ data: result, meta: { total: result.length } });
    }
  } catch (err) {
    next(err);
  }
};

exports.assign = (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req.body;
    const ticket = service.assignTicket(id, user);
    if (!ticket) {
      const err = new Error("Ticket no encontrado");
      err.status = 404;
      throw err;
    }
    res.status(200).json(ticket);
  } catch (err) {
    next(err);
  }
};

exports.changeStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const ticket = service.changeStatus(id, status);
    if (!ticket) {
      const err = new Error("Ticket no encontrado");
      err.status = 404;
      throw err;
    }
    res.status(200).json(ticket);
  } catch (err) {
    next(err);
  }
};

exports.delete = (req, res, next) => {
  try {
    service.deleteTicket(req.params.id);
    res.json({ message: "Ticket eliminado correctamente" });
  } catch (err) {
    next(err);
  }
};

// nuevo: obtener notificaciones por ticket
exports.notificationsByTicket = (req, res, next) => {
  try {
    const { id } = req.params;
    const notifications = notificationService.listByTicket(id);
    res.status(200).json({ ticketId: id, notifications });
  } catch (err) {
    next(err);
  }
};
