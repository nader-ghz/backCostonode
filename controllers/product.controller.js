import Product from '../models/product.js';
import ProductImage from '../models/productImage.js';
import nodemailer from 'nodemailer';

import Order from '../models/order.js';
import OrderProduct from '../models/OrderProduct.js';

export const createProductcheckout = async (req, res) => {


const { name, phone, email, address, governorate, delivery, products, total } = req.body;

  try {
    const order = await Order.create({ name, phone, email, address, governorate, delivery, total });

    // Create order products
    const orderProducts = products.map(product => ({
      title: product.title,
      price: product.price,
      category: product.category,
      productId: product.id,
      OrderId: order.id
    }));

    await OrderProduct.bulkCreate(orderProducts);

    // Send email confirmation
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "744fa8001@smtp-brevo.com",
          pass: "D1Jg3adRbt2MKPGN",
        },
    });

    const mailOptions = {
      from: 'costo@gmail.com',
      to: email,
      subject: 'Order Confirmation',
   
   
   
   
      html: `
      <div style="max-width: 628px; margin: auto; padding: 20px; background-color: #fff; border-radius: 10px; font-family: Arial, sans-serif; color: #333;">
      <div style="text-align: center;">
          <img src="https://i.pinimg.com/originals/17/07/c7/1707c7bd209e7c420f94037d1ae5cbb4.jpg" alt="Odin E-sport" style="max-width: 100%; height: auto;">
      </div>
      <h1 style="text-align: center; color: #333;">Commande Costo</h1>
      <div style="text-align: center; margin: 12px auto;">
          <table style="width: 100%; border-collapse: collapse; margin: auto;">
              <tr>
                  <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Name:</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${name}</td>
              </tr>
              <tr>
                  <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Phone:</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${phone}</td>
              </tr>
              <tr>
                  <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Email:</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${email}</td>
              </tr>
              <tr>
                  <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Address:</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${address}</td>
              </tr>
              <tr>
                  <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Governorate:</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${governorate}</td>
              </tr>
              <tr>
                  <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Delivery:</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${delivery}</td>
              </tr>
              <tr>
                  <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Total:</td>
                  <td style="padding: 8px; border: 1px solid #ddd;">${total}</td>
              </tr>
          </table>
          <h2 style="text-align: center; margin-top: 20px;">Products:</h2>
          <table style="width: 100%; border-collapse: collapse; margin: auto;">
              ${products.map(product => `
                  <tr>
                      <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Title:</td>
                      <td style="padding: 8px; border: 1px solid #ddd;">${product.title}</td>
                      <td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">Price:</td>
                      <td style="padding: 8px; border: 1px solid #ddd;">${product.price}</td>
                  </tr>
              `).join('')}
          </table>
      </div>
      <div style="text-align: center; margin-top: 20px;">
        <a href="https://www.facebook.com/ana9a.tn?locale=fr_FR" style="text-decoration: none !important; margin: 0 10px; display: inline-block; border-radius: 50%;">
        lien facebook click ici  <img src="https://i.pinimg.com/originals/17/07/c7/1707c7bd209e7c420f94037d1ae5cbb4.jpg" alt="Facebook Icon" style="max-width: 50px; height: auto; border-radius: 50%;">
        </a>
    </div>
     
  </div>
  
      
      
      
      
      
            
      
      
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};





export const createProduct = async (req, res) => {
    try {
      const { title, description, price, discountPercentage, rating, stock, Tag, category, Color, Taille } = req.body;
      
      const product = await Product.create({
        title,
        description,
        price,
        discountPercentage,
        rating,
        stock,
        Tag,
        category,
        Color,
        Taille
      });
  
      const images = req.files.map(file => ({ url: file.filename, productId: product.id })); // Save full filename with unique prefix
      await ProductImage.bulkCreate(images);
  
      const createdProduct = await Product.findByPk(product.id, { include: [ProductImage] });
      res.status(201).json(createdProduct);
    } catch (error) {
      res.status(400).json({ msg: error.message });
    }
  };
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ include: [ProductImage] });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { category: req.params.category },
      include: [ProductImage]
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, { include: [ProductImage] });
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, {
      where: { id: req.params.id }
    });
    if (!updated) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    const updatedProduct = await Product.findByPk(req.params.id, { include: [ProductImage] });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, { include: [ProductImage] });
    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }
    await ProductImage.destroy({ where: { productId: req.params.id } });
    await Product.destroy({ where: { id: req.params.id } });
    res.status(200).json({ msg: `Product with id ${req.params.id} and its related images removed successfully` });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
