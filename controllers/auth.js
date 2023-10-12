import bcrypt from "bcrypt";
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors/index.js';
import jwt from 'jsonwebtoken';
import User from "../models/User.js";

export const register = async (req, res, next) => {

    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        throw new BadRequestError('Por favor, completar todos los datos antes de enviar');
    }

    if (password.length < 6) throw new BadRequestError('Contraseña debe tener al menos 6 caracteres')

    const emailLowercase = email.toLowerCase()

    const emailExists = await User.findOne({ emailLowercase });
    if (emailExists) {
        throw new BadRequestError('Email ya está en uso');
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const user = new User({
        fullName,
        email: emailLowercase,
        password: hash,
    });

    await user.save();

    res.status(StatusCodes.CREATED).json({
        "success": "Usuario creado con éxito"
    });
};

export const login = async (req, res, next) => {
    const { email, password: userReqPassword } = req.body

    if (!email) throw new BadRequestError('Ingresa tu nombre de usuario o email')

    const emailLowercase = email.toLowerCase()

    let user = await User.findOne({ email: emailLowercase });

    if (!user) throw new UnauthenticatedError('Usuario no existe')

    const isPasswordCorrect = await bcrypt.compare(userReqPassword, user.password)
    if (!isPasswordCorrect) throw new BadRequestError('Contraseña incorrecta')

    const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT,
        { expiresIn: process.env.JWT_LIFETIME } // production: ~ 1h
    )

    const refreshToken = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.REFRESH_JWT,
        { expiresIn: process.env.REFRESH_JWT_LIFETIME }
    )

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 20 * 24 * 60 * 60 * 1000 }); // secure: true, sameSite: 'None'

    const { _id, isAdmin } = user._doc;

    res.status(StatusCodes.OK).json({
        details: { _id, isAdmin },
        token: token
    })

}

export const logout = async (req, res, next) => {
    // Delete the accessToken on client

    const cookies = req.cookies

    if (!cookies?.jwt) throw new UnauthenticatedError('Problem with cookies')

    const refreshTokenValue = cookies.jwt;

    let user = await User.findOne({ refreshToken: refreshTokenValue });
    if (!user) {
        res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' }); // Add secure: true
        return res.status(StatusCodes.NO_CONTENT).send();
    }

    // Delete refreshToken in db
    user.refreshToken = ""; // Clear the refreshToken field
    await user.save();

    res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'None' }); // Add secure: true
    return res.status(StatusCodes.NO_CONTENT).send();
}

export const refreshToken = async (req, res, next) => {
    const cookies = req.cookies

    if (!cookies?.jwt) throw new UnauthenticatedError('Problem with cookies')

    const refreshTokenValue = cookies.jwt;

    let user = await User.findOne({ refreshToken: refreshTokenValue });
    if (!user) throw new UnauthenticatedError('Usuario no encontrado')


    jwt.verify(
        refreshTokenValue,
        process.env.REFRESH_JWT,
        (err, decoded) => {
            if (err || user._id.toString() !== decoded.id) return res.sendStatus(403);

            const accessToken = jwt.sign(
                { id: decoded.id, isAdmin: decoded.isAdmin },
                process.env.JWT,
                { expiresIn: process.env.JWT_LIFETIME }
            )
            res.status(StatusCodes.OK).json({
                user: {
                    _id: user._id,
                    isAdmin: user.isAdmin
                },
                token: accessToken
            })
        }
    )
}