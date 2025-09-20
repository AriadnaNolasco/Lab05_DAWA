const { v4: uuidv4 } = require("uuid");
const TicketRepository = require("../repositories/TicketRepository");
const NotificationService = require("./NotificationService");

class TicketService {
    constructor() {
        this.repo = new TicketRepository();
        this.notificationService = new NotificationService();
    }

    createTicket(data) {
        const ticket = {
            id: uuidv4(),
            title: data.title,
            description: data.description,
            status: "nuevo",
            priority: data.priority || "medium",
            assignedUser: null
        };

        this.repo.save(ticket);
        this.notificationService.create("email", `Nuevo ticket creado: ${ticket.title}`, ticket.id);

        return ticket;
    }

    assignTicket(id, user) {
        const ticket = this.repo.update(id, { assignedUser: user });
        if (ticket) {
            this.notificationService.create("email", `El ticket ${ticket.id} fue asignado a ${user}`, ticket.id);
        }
        return ticket;
    }

    changeStatus(id, newStatus) {
        const ticket = this.repo.update(id, { status: newStatus });
        if (ticket) {
            this.notificationService.create("push", `El ticket ${ticket.id} cambió a ${newStatus}`, ticket.id);
        }
        return ticket;
    }

    // list ahora soporta paginación: si page & limit son null devuelve todo
    list(page, limit) {
        const all = this.repo.findAll() || [];

        // si no se piden parámetros devuelve todo
        if (!page && !limit) return all;

        const p = Math.max(parseInt(page || 1, 10), 1);
        const l = Math.max(parseInt(limit || 5, 10), 1);

        const total = all.length;
        const totalPages = Math.ceil(total / l);
        const start = (p - 1) * l;
        const items = all.slice(start, start + l);

        return {
            meta: {
                total,
                page: p,
                limit: l,
                totalPages
            },
            data: items
        };
    }

    deleteTicket(id) {
        const deleted = this.repo.delete(id);
        if (!deleted) {
            const err = new Error("Ticket no encontrado");
            err.status = 404;
            throw err;
        }
        return true;
    }
}

module.exports = TicketService;
