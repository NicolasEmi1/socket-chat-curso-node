const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();

io.on('connection', (client) => {

    // Cuando una persona entra al chat...
    client.on('entrarChat', (data, callback) => {
        // console.log(data);
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario/a'
            });
        }

        client.join(data.sala);

        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        client.broadcast.to(data.sala).emit('listaPeronas', usuarios.getPersonasPorSala(data.sala)); // Notifica a todos los usuarios la lista actualizada de usuarios conectados

        callback(usuarios.getPersonasPorSala(data.sala));
    });

    // Cuando una persona quiere mandar a TODOS un mensaje...
    client.on('crearMensaje', (data) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    });

    // Cuando una persona se desconecta del chat...
    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona(client.id);
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandonó el chat`));
        client.broadcast.to(personaBorrada.sala).emit('listaPeronas', usuarios.getPersonasPorSala(personaBorrada.sala)); // Notifica a todos los usuarios la lista actualizada de usuarios conectados
    });

    // Cuando una persona quiere enviar un mensaje privado a otra persona...
    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

        // Se invoca por consola así:
        // socket.emit('mensajePrivado',{mensaje: 'Holis a Meli', para: 'hXVoHt4VR1i8ugW6AAAF'});
    });

});