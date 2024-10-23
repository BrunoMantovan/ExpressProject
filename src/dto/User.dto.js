class UserDTO {
    constructor(user) {
        this.id = user._id;
        this.nombre = user.nombre;
        this.apellido = user.apellido;
        this.email = user.email;
        this.rol = user.rol;
    }
}

export default UserDTO;