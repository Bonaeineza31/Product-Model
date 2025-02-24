import Product from "../models/productModel.js";
import { uploadImage, deleteImage } from "../utils/cloudinary.js";
import fs from 'fs';

// Create a new product
export const createProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Product image is required' });
    }

    const result = await uploadImage(req.file.path);
   
    const { productName, productPrice, productCategory, productDiscount } = req.body;
    const newProduct = new Product({
      productName,
      productPrice,
      productCategory,
      productDiscount: productDiscount || 0,
      productImage: result.secure_url
    });

    await newProduct.save();
    
    // Delete the file from server after upload
    fs.unlinkSync(req.file.path);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct
    });
  } catch (error) {
    // Delete uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Update product by ID
export const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let updatedData = req.body;
    const product = await Product.findById(id);
    
    if (!product) {
      // Delete uploaded file if it exists
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // If there's a new image, upload it and update the URL
    if (req.file) {
      // Extract public_id from the current image URL
      const currentImageUrl = product.productImage;
      const publicIdMatch = currentImageUrl.match(/products\/[^.]+/);
      
      if (publicIdMatch) {
        try {
          // Delete old image from Cloudinary
          await deleteImage(publicIdMatch[0]);
        } catch (error) {
          console.error("Error deleting old image:", error);
        }
      }
      
      // Upload new image
      const result = await uploadImage(req.file.path);
      updatedData.productImage = result.secure_url;
      
      // Delete local file after upload
      fs.unlinkSync(req.file.path);
    }
    
    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    // Delete uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Delete product by ID
export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Extract public_id from the image URL
    const imageUrl = product.productImage;
    const publicIdMatch = imageUrl.match(/products\/[^.]+/);
    
    if (publicIdMatch) {
      try {
        // Delete image from Cloudinary
        await deleteImage(publicIdMatch[0]);
      } catch (error) {
        console.error("Error deleting image:", error);
      }
    }
    
    // Delete product from database
    await Product.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};