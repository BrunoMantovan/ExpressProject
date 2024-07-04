/* import express from "express";

const app = express();

//middleware
app.use(express.json()) //parsea el body
app.use(express.urlencoded({extended: true})) //permite recibir formularios de las urls

const db = []
let id = 0




app.get("/", (req, res) => {
    res.status(201).json({
        payload: [...db],
        mensaje: "Todo ok"
    });
});

app.post("/", (req, res) => {
    const user = req.body
    

    
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
    }) 
})

app.put("/", (req, res) => {
    const modeUser = req.body

    if(modeUser.nombre !== "Daniel"){
        return res.status(400).json({
            detalle: "funciono mal"
        })
    }

    res.status(200).json({
        ...usuario,
        mensaje: "funciono bien"
    })
})

app.listen(8000, () => {
    console.log("Server running at http://localhost:8000/");
}) */