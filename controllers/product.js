import { StatusCodes } from 'http-status-codes';
import { BadRequestError, NotFoundError } from '../errors/index.js'
import Product from "../models/Product.js"

export const createProduct = async (req, res) => {
    const { title, price, category } = req.body

    if (!title, !price, !category) throw new BadRequestError("Producto debe contener nombre, precio y categoría")

    const newProduct = new Product({ ...req.body })
    const savedProduct = await newProduct.save()
    if (!savedProduct) throw new BadRequestError("Ha ocurrido un error al guardar producto")

    res.status(StatusCodes.OK).json(savedProduct)

}

export const updateProduct = async (req, res) => {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    if (!updatedProduct) throw new NotFoundError('El producto que queres editar no existe')

    res.status(StatusCodes.OK).json(updatedProduct)

}

export const deleteProduct = async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) throw new NotFoundError('El producto que queres eliminar no existe')

    res.status(StatusCodes.OK).json('Producto ha sido eliminado con éxito')

}

export const getProduct = async (req, res) => {

    const product = await Product.findById(req.params.id)
    if (!product) throw new NotFoundError('El producto que intentas buscar no existe')

    res.status(StatusCodes.OK).json(product)

}

export const getAllProducts = async (req, res) => {
    const products = await Product.find()
    if (!products) throw new NotFoundError("No se encontraron productos")

    res.status(StatusCodes.OK).json(products)

}