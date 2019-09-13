class Usuarios {

    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre, sala) {
        let persona = { id, nombre, sala };

        this.personas.push(persona);

        return this.personas;
    }

    getPersona(id) {
        let persona = this.personas.filter(per => {
            return per.id === id;
        })[0]; // Devuelve el PRIMER ELEMENTO que coincide con el ID que viene por parámetro

        return persona;
    }

    getPersonas() {
        return this.personas;
    }

    getPersonasPorSala(sala) {
        // Implementar luego

        let personasEnSala = this.personas.filter(per => {
            return per.sala === sala;
        });

        return personasEnSala;
    }

    borrarPersona(id) {
        let personaBorrada = this.getPersona(id);

        this.personas = this.personas.filter(per => per.id !== id);

        return personaBorrada;
    }
    
}

module.exports = {
    Usuarios
}