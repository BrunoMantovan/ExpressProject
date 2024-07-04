import {Router} from "express";
import { uploader } from "../utils.js";

const router = Router();

let db = [{ name: "John", id: 1,  }, { name: "Jane", id: 2,  },]
let id = 0

router.get("/", (req, res) => {
    res.status(201).json({
        payload: [...db],
        mensaje: "Todo ok"
    });
});

router.post("/", uploader.single("avatar") ,(req, res) => {
    console.log(req.file)
    /* const user = req.body //recibimos la info que viene del body
    
    if(user.nombre == " " || user.edad == 0){
        return res.status(400).json({
            detalle: "funciono mal"
        })
    }

    id++;

    db.push({...user, "id": id})
    console.log(db)
    res.status(201).json({
        ...user,
        mensaje: "Información recibida"
    })  */
})

router.put("/:id", (req, res) => {
    const modeUser = req.body
    const {id} = req.params
    const userIndex = db.findIndex(user => user.id == id);

    if(userIndex === -1){
        return res.status(400).json({
            detalle: "funciono mal"
        })
    }

    delete modeUser.id;
    db[userIndex] = { ...db[userIndex], ...modeUser };
    console.log(db)
    res.status(200).json({
        ...db[userIndex],
        mensaje: "funciono bien",
        payload: [...db],
    })
})

router.delete("/:id", (req, res) => {
    const {id} = req.params
    const filteredDb = db.filter(user => user.id !== id) //filtramos la base de datos, eliminando el id que pasamos en la url

    db = [...filteredDb]

    res.status(200).json({
        mensaje: "Usuario eliminado",
        payload: [...db],
    })
})

export default router;