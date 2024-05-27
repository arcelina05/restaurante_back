const fs = require('fs/promises');
const path = require('path');
const client = require('../db/database');
const { ObjectId } = require('mongodb');


const listarPedidos = async (req, res) => {
   
    try {
        // Consultar todos los productos en la base de datos
        const db= client.db('restaurante')
        const collection= db.collection('pedidos')
        const pedidosProcesando = await collection.find({ estado: "procesando" }).toArray();
        res.json(pedidosProcesando); // Enviar la lista de productos como respuesta
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.status(500).json({ mensaje: 'Error al obtener los pedidos' });
    }
};

// const listarPedidos = async (req,res) => {
    
//     const pedidos = await fs.readFile(path.join(__dirname,'../db/pedidos.json'));
//     const pedidosJson= JSON.parse(pedidos);

//     res.json(pedidosJson.filter(pedido => pedido.estado == "procesando"));
// } 

const crearPedido = async (req, res) => {
    const nuevoPedido= req.body;
      
    try {
        const db= client.db('restaurante')
        const collection= db.collection('pedidos')
        const newProducto = await collection.insertOne(nuevoPedido);

        res.json({ mensaje: "Pedido creado" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ mensaje: "Error al crear el pedido" });
    }
};

// const crearPedido = async (req, res)=>{
//     const nuevoPedido= req.body

//     //consulta el ultimo id insertado en el json para seguir el consecutivo
//     const pedidos = await fs.readFile(path.join(__dirname,'../db/pedidos.json'));
//     const pedidosJson= JSON.parse(pedidos);

//     //consulta el tañamo del json para saber si tiene elementos ya insertados
//     let ultimoId = 0;
//     if(pedidosJson.length > 0){
//         //obtenemos el producto q esta en al ultima posicion
//         const ultimoPedido =pedidosJson[pedidosJson.length - 1];
//         //obtenemos el id y le sumamos 1
//         ultimoId = ultimoPedido.id+1; 
//     }

//     nuevoPedido.id = ultimoId;
//     pedidosJson.push(nuevoPedido);

//     await fs.writeFile(path.join(__dirname,'../db/pedidos.json'), JSON.stringify(pedidosJson, null, 2), {encoding: 'utf-8'})
    
//     res.json({mensaje:"pedido creado"});
// }

// const actualizarEstadoPedido = async (req, res) => {
//     const { id } = req.params;
//     const { estado } = req.body;

//     try {
//         // Busca y actualiza el pedido en la base de datos MongoDB
//         const pedido = await Usuario.findOneAndUpdate(
//             { _id: id }, // Filtra el pedido por su ID
//             { estado: estado }, // Actualiza el estado del pedido
//             { new: true } // Devuelve el pedido actualizado
//         );

//         if (!pedido) {
//             return res.status(404).json({ mensaje: "Pedido no encontrado" });
//         }

//         res.json({ mensaje: "Pedido actualizado", pedido: pedido });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ mensaje: "Error al actualizar el pedido" });
//     }
// };


const actualizarEstadoPedido = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;

    try {
        const db= client.db('restaurante')
        const collection = db.collection('pedidos');

    
        const objectId = new ObjectId(id);

    
        const resultadoActualizacion = await collection.updateOne(
            { _id: objectId },
            { $set: { estado: estado } },
            { new: true }
        );


        if (resultadoActualizacion.matchedCount === 1) {
            res.json({ mensaje: "Estado del pedido actualizado correctamente" });
        } else {
            res.status(404).json({ mensaje: "No se encontró el pedido para actualizar" });
        }
    } catch (error) {
        console.error('Error al actualizar el estado del pedido:', error);
        res.status(500).json({ mensaje: 'Error al actualizar el estado del pedido' });
    }
}

// const actualizarEstadoPedido = async (req, res)=>{
//     const {id} = req.params;
//     const {estado} = req.body;

//     const pedidos = await fs.readFile(path.join(__dirname,'../db/pedidos.json'));
//     const pedidosJson= JSON.parse(pedidos);

    
//     const pedido = pedidosJson.find(pedido => pedido.id == id);
    
//     pedido.estado = estado;

//     await fs.writeFile(path.join(__dirname,'../db/pedidos.json'), JSON.stringify(pedidosJson, null, 2), {encoding: 'utf-8'})
//     res.json({mensaje:"pedido  actualizado"});

// }


module.exports = {
    listarPedidos,
    crearPedido,
    actualizarEstadoPedido
}