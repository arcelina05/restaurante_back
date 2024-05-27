const fs = require('fs/promises');
const path = require('path');
const client = require('../db/database');
const { ObjectId } = require('mongodb');


const listarProductos = async (req, res) => {
   
    try {
        // Consultar todos los productos en la base de datos
        const db= client.db('restaurante')
        const collection= db.collection('productos')
        const productos = await collection.find().toArray();
        res.json(productos); // Enviar la lista de productos como respuesta
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ mensaje: 'Error al obtener los productos' });
    }
};



const crearProducto = async (req, res) => {
    const nuevoProducto = req.body;
      
    try {
        const db= client.db('restaurante')
        const collection= db.collection('productos')
        const newProducto = await collection.insertOne(nuevoProducto);

        res.json({ mensaje: "Producto creado" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ mensaje: "Error al crear el producto" });
    }
};
// const crearProducto = async (req, res)=>{
//     const nuevoProducto= req.body

//     //consultar el ultimo id insertado en el json para seguir el consecutivo
//     const productos = await fs.readFile(path.join(__dirname,'../db/productos.json'));
//     const productosJson= JSON.parse(productos);

//     //consultar el tañamo del json para saber si tiene elementos ya insertados
//     let ultimoId = 0;
//     if(productosJson.length > 0){
//         //obtenemos  el producto q esta en al ultima posicion
//         const ultimoProducto =productosJson[productosJson.length - 1];
//         //obtenemos el id y le sumamos 1
//         ultimoId = ultimoProducto.id+1; 
//     }

//     nuevoProducto.id = ultimoId;

//     //insertar el nuevo producto en el arreglo de productos
//     productosJson.push(nuevoProducto);

//     //escribir el archivo json con los nuevos productos actualizado
//     await fs.writeFile(path.join(__dirname,'../db/productos.json'), JSON.stringify(productosJson, null, 2), {encoding: 'utf-8'})
    
//     res.json({mensaje:"producto creado"});
// }

const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const nuevosDatosProducto = req.body;

    try {
        // Busca y actualiza el producto en la base de datos MongoDB
        const db = client.db('restaurante');
        const collection = db.collection('productos');
        const objectId = new ObjectId(id);
        const resultadoActualizacion = await collection.updateOne(
            { _id: objectId },
            { $set: nuevosDatosProducto }
        );

        if (resultadoActualizacion.matchedCount === 1 && resultadoActualizacion.modifiedCount === 1) {
            res.json({ mensaje: "Producto actualizado correctamente" });
        } else {
            res.status(404).json({ mensaje: "No se encontró el producto para actualizar" });
        }
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({ mensaje: 'Error al actualizar el producto' });
    }
};


// const actualizarProducto = async (req, res)=>{
//     const {id} = req.params;
//     const nuevosDatosProducto = req.body;

//     const productos = await fs.readFile(path.join(__dirname,'../db/productos.json'));
//     const productosJson= JSON.parse(productos);

//     //Buscar y obtener en que posicion se encuentra el producto que se va a actualizar
//     const indiceProducto = productosJson.findIndex(producto => producto.id == id);
    
//     // si el indice es diferente de -1 quiere decir que encontro el producto
//     if(indiceProducto != -1 ){
//         productosJson[indiceProducto] = {...productosJson[indiceProducto], ...nuevosDatosProducto};

//         //escribir el archivo json con los nuevos productos actualizado
//         await fs.writeFile(path.join(__dirname,'../db/productos.json'), JSON.stringify(productosJson, null, 2), {encoding: 'utf-8'})
//         res.json({mensaje:"producto  actualizado"});
//     }else{
//         res.json({mensaje:"no se ha encontrado elproducto"});
//     }
// }

// const eliminarProducto = async (req, res) => {
//     const { id } = req.params;

//     const productos = await fs.readFile(path.join(__dirname, '../db/productos.json'));
//     let productosJson = JSON.parse(productos);

//     // Buscar y eliminar el producto con el ID proporcionado
//     const indiceProducto = productosJson.findIndex(producto => producto.id == id);
    
//     if (indiceProducto !== -1) {
//         productosJson.splice(indiceProducto, 1); // Eliminar el producto del arreglo
//         // Escribir el archivo JSON con los productos actualizados
//         await fs.writeFile(path.join(__dirname, '../db/productos.json'), JSON.stringify(productosJson, null, 2), { encoding: 'utf-8' });
//         res.json({ mensaje: "Producto eliminado correctamente" });
//     } else {
//         res.json({ mensaje: "No se ha encontrado el producto" });
//     }
// };

const eliminarProducto = async (req, res) => {
    const { id } = req.params;

    try {
        // Buscar y eliminar el producto por su ID
        const db= client.db('restaurante')
        const collection= db.collection('productos')
        const objectId = new ObjectId(id);
        const productoEliminado = await collection.findOneAndDelete({ _id: objectId });

        if (productoEliminado) {
            res.json({ mensaje: "Producto eliminado correctamente" });
        } else {
            res.status(404).json({ mensaje: "No se ha encontrado el producto" });
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({ mensaje: 'Error al eliminar el producto' });
    }
};

module.exports = {
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    listarProductos
}
