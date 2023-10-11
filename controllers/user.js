import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError, UnauthenticatedError } from '../errors/index.js'
import User from "../models/User.js"
import bcrypt from "bcrypt";

export const updateUser = async (req, res) => {
    const user = await User.findById(req.params.id)

    if (!user) throw new NotFoundError('Usuario no encontrado')

    if (!req.body.userData) throw new NotFoundError('Error al encontrar información acerca del usuario')

    const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: { ...req.body.userData } }, { new: true })
    if (!updatedUser) throw new NotFoundError('Error al editar usuario')

    res.status(StatusCodes.OK).json({ msg: "User updated correctly" })
}

export const handleChangePassword = async (req, res) => {
    const { id } = req.params;

    const { password, cpassword } = req.body;

    if (!password || !cpassword) throw new BadRequestError('Debes completar los campos antes de enviar')
    if (password !== cpassword) throw new BadRequestError('Contraseñas no coinciden')
    if (password.length < 6 || cpassword.length < 6) throw new BadRequestError('Contraseña debe tener al menos 6 caracteres')

    const validUser = await User.findOne({ _id: id });
    if (!validUser) throw new UnauthenticatedError('Usuario no existe')

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const setNewUserPass = await User.findByIdAndUpdate({ _id: id }, { $set: { password: hash } }, { new: true });

    setNewUserPass.save();

    res.status(StatusCodes.NO_CONTENT).send()
}

export const deleteUser = async (req, res) => {

    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) throw new NotFoundError('Usuario no existe')
    res.status(StatusCodes.OK).json('Usuario eliminado con éxito')

}

export const getUser = async (req, res) => {

    const user = await User.findById(req.params.id)
    if (!user) throw new NotFoundError('Usuario no existe')

    res.status(StatusCodes.OK).json({
        user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
        }
    })
}

export const getUsers = async (req, res) => {
    const users = await User.find()
    if (!users) throw new NotFoundError('Error al obtener usuarios')

    res.status(StatusCodes.OK).json(users)
}

