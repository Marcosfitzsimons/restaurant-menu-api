import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        minLength: 3,
        maxLength: 35,
        required: [true, 'Por favor, ingresar nombre completo.']
    },
    email: {
        type: String,
        required: [true, 'Por favor, ingresar email.'],
        minLength: 3,
        maxLength: 40,
        trim: true,
        unique: true,
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Por favor, escribí un email válido.'],
    },
    password: {
        type: String,
        required: [true, 'Por favor, ingresar contraseña.'],
        minLength: 6,
        maxLength: 100,
        trim: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String
    }
},
    { timestamps: true }
);

export default mongoose.model('User', UserSchema)