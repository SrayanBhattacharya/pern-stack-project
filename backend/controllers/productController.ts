import { sql } from "../config/db.js";
import { Request, Response } from "express";

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await sql`
            SELECT * FROM products
            ORDER BY created_at
        `;

    res.status(200).json({ success: true, data: products });
  } catch (error: unknown) {
    console.log("Error getAllProducts", error);
    if (error instanceof Error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ success: false, message: "Unknown error" });
    }
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await sql`
        SELECT * FROM products
        WHERE id=${id}
    `;
    res.status(200).json({ success: true, data: product[0] });
  } catch (error: unknown) {
    console.log("Error getProduct", error);
    if (error instanceof Error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ success: false, message: "Unknown error" });
    }
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, price, image } = req.body;
  if (!name || !price || !image) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const newProduct = await sql`
        INSERT INTO products (name, price, image)
        VALUES (${name}, ${price}, ${image})
        RETURNING *
    `;
    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error: unknown) {
    console.log("Error createProduct", error);
    if (error instanceof Error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ success: false, message: "Unknown error" });
    }
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price, image } = req.body;

  try {
    const updatedProduct = await sql`
        UPDATE products
        SET name=${name}, price=${price}, image=${image}
        WHERE id=${id}
        RETURNING *
    `;

    if (updatedProduct.length === 0) {
      res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: updatedProduct[0] });
  } catch (error: unknown) {
    console.log("Error updateProduct", error);
    if (error instanceof Error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ success: false, message: "Unknown error" });
    }
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedProduct = await sql`
        DELETE FROM products WHERE id=${id}
        RETURNING *
    `;

    if (deletedProduct.length === 0) {
      res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: deletedProduct[0] });
  } catch (error: unknown) {
    console.log("Error deleteProduct", error);
    if (error instanceof Error) {
      console.error(error.message);
      res.status(500).json({ success: false, message: error.message });
    } else {
      console.error(error);
      res.status(500).json({ success: false, message: "Unknown error" });
    }
  }
};
