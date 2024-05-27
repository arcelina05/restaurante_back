const fs = require('fs/promises');
const path = require('path');
const client = require('../db/database');
const { ObjectId } = require('mongodb');


const login = async (req, res) => {
    const { body } = req;
    const { username, password } = body;

    try {
        const db= client.db('restaurante')
        const collection= db.collection('usuarios')

    
        const usuario = await collection.findOne({ nombre: username, password: password });

        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ mensaje: "Usuario no encontrado o contraseña incorrecta" });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ mensaje: 'Error al iniciar sesión' });
    }
};

// const login = async (req, res)=>{
//     const {body} = req;
//     const {username,password} = body;
//     const usuarios = await fs.readFile(path.join(__dirname,'../db/usuarios.json'));
//     const usuariosJson = JSON.parse(usuarios)
//     const usuario= usuariosJson.find(user=> user.nombre==username && user.password == password)
//     res.json(usuario)
// }


const listarUsuarios = async (req, res) => {
   
    try {
        const db= client.db('restaurante')
        const collection= db.collection('usuarios')
        const usuario = await collection.find().toArray();
        res.json(usuario);
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        res.status(500).json({ mensaje: 'Error al obtener los usuarios' });
    }
};

// const listarUsuarios = async (req,res) => {
    
//     const usuarios = await fs.readFile(path.join(__dirname,'../db/usuarios.json'));
//     const usuariosJson= JSON.parse(usuarios);

//     res.json(usuariosJson);
// } 


const crearUsuario = async (req, res) => {
    const nuevoUsuario = req.body;
      
    try {
        const db= client.db('restaurante')
        const collection= db.collection('usuarios')
        const newUsuario = await collection.insertOne(nuevoUsuario);

        res.json({ mensaje: "Usuario creado" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ mensaje: "Error al crear el usuario" });
    }
};


// const crearUsuario = async (req, res)=>{
//     const nuevoUsuario= req.body

//     //consulta el ultimo id insertado en el json para seguir el consecutivo
//     const usuarios = await fs.readFile(path.join(__dirname,'../db/usuarios.json'));
//     const usuariosJson= JSON.parse(usuarios);

//     //consulta el tañamo del json para saber si tiene elementos ya insertados
//     let ultimoId = 0;
//     if(usuariosJson.length > 0){
    
//         const ultimoIndex =usuariosJson[usuariosJson.length - 1];
//         //obtenemos el id y le sumamos 1
//         ultimoId = ultimoIndex.id+1; 
//     }

//     nuevoUsuario.id = ultimoId;

//     //inserta el nuevo usuario en el arreglo de usuarios
//     usuariosJson.push(nuevoUsuario);

//     //escribe en  el archivo json con los nuevos usuarios actualizado
//     await fs.writeFile(path.join(__dirname,'../db/usuarios.json'), JSON.stringify(usuariosJson, null, 2), {encoding: 'utf-8'})
    
//     res.json({mensaje:"usuario creado"});
// }


const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const nuevosDatosUsuario = req.body;

    try {
        const db = client.db('restaurante');
        const collection = db.collection('usuarios');
        const objectId = new ObjectId(id);
        const usuarioActualizacion = await collection.updateOne(
            { _id: objectId },
            { $set: nuevosDatosUsuario }
        );

        if (usuarioActualizacion.matchedCount === 1 && usuarioActualizacion.modifiedCount === 1) {
            res.json({ mensaje: "Usuarios actualizado correctamente" });
        } else {
            res.status(404).json({ mensaje: "No se encontró el Usuario para actualizar" });
        }
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ mensaje: 'Error al actualizar el usuario' });
    }
};

// const actualizarUsuario = async (req, res)=>{
//     const {id} = req.params;
//     const nuevosDatosUsuario = req.body;

//     const usuarios = await fs.readFile(path.join(__dirname,'../db/usuarios.json'));
//     const usuariosJson= JSON.parse(usuarios);

//     //Busca y obtiene en que posicion se encuentra el usuario que se va a actualizar
//     const indiceUsuario = usuariosJson.findIndex(usuario => usuario.id == id);
    
//     // si el indice es diferente de -1 quiere decir que encontro el usuario
//     if(indiceUsuario != -1 ){
//         usuariosJson[indiceUsuario] = {...usuariosJson[indiceUsuario], ...nuevosDatosUsuario};

//         //escribe en el archivo json los nuevos usuarios actualizado
//         await fs.writeFile(path.join(__dirname,'../db/usuarios.json'), JSON.stringify(usuariosJson, null, 2), {encoding: 'utf-8'})
//         res.json({mensaje:"usuario  actualizado"});
//     }else{
//         res.json({mensaje:"no se ha encontrado el usuario"});
//     } 
// }


const eliminarUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const db= client.db('restaurante')
        const collection= db.collection('usuarios')
        const objectId = new ObjectId(id);
        const usuarioEliminado = await collection.findOneAndDelete({ _id: objectId });

        if (usuarioEliminado) {
            res.json({ mensaje: "usuario eliminado correctamente" });
        } else {
            res.status(404).json({ mensaje: "No se ha encontrado el usuario" });
        }
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ mensaje: 'Error al eliminar el usuario' });
    }
};


// const eliminarUsuario = async (req, res) => {
//     const { id } = req.params;

//     const usuarios = await fs.readFile(path.join(__dirname, '../db/usuarios.json'));
//     let usuariosJson = JSON.parse(usuarios);

//     // Busca y elimina el usuario con el ID proporcionado
//     const indiceUsuario = usuariosJson.findIndex(usuario => usuario.id == id);
    
//     if (indiceUsuario !== -1) {
//         usuariosJson.splice(indiceUsuario, 1); // Elimina el usuario del arreglo
//         // Escribe en el archivo JSON  los usuarios actualizados
//         await fs.writeFile(path.join(__dirname, '../db/usuarios.json'), JSON.stringify(usuariosJson, null, 2), { encoding: 'utf-8' });
//         res.json({ mensaje: "Usuario eliminado correctamente" });
//     } else {
//         res.json({ mensaje: "No se ha encontrado el usuario" });
//     }
// };


module.exports = {
    login,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    listarUsuarios
}