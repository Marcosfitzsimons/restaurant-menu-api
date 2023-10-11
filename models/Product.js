import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        minLength: 2,
        maxLength: 60,
        required: [true, 'Por favor, ingresar nombre al producto'],
    },
    englishTitle: {
        type: String,
        minLength: 2,
        maxLength: 60,
    },
    description: {
        type: String,
        minLength: 6,
        maxLength: 180,
    },
    price: {
        type: Number,
        required: true,
        min: 1,
        max: 100000
    },
    category: {
        type: String,
        enum: [
            "promos",
            "cafeteria",
            "dulces",
            "bebidas",
            "bebidas-alcohol",
            "hamburguesas",
            "pizzas",
            "sandwiches-tostados",
            "sandwiches-especiales",
            "ensaladas",
            "empanadas",
            "panchos",
        ],
        required: true,
    },
}
);

export default mongoose.model('Product', ProductSchema)