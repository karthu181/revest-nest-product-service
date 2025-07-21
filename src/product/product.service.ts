import { ConflictException, HttpCode, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Product } from './product.model'; // Assuming you have a Product interface defined
import { CreateProductDto } from './dto/createProduct.dto';
import { v4 as uuidv4 } from 'uuid';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { Client } from 'pg';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class ProductService {
 constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  private products: Product[] = [
    {
      id: 1,
      name: 'Phone',
      price: 500,
      description: 'This is a phone',
      stock: 100,
    },
    {
      id: 2,
      name: 'Laptop',
      price: 1200,
      description: 'This is a laptop',
      stock: 100,
    },
  ];

  async getAllProducts() {
    //using database
    const products = await this.productRepository.query(`SELECT * FROM products`);
    console.log('Fetching all products:', products);
    return products;

    //using memory
    // return this.products;

  }

  async getProductById(id: number) {
    //using database
    const product = await this.productRepository.query(`SELECT * FROM products WHERE id = $1`, [id]);
    return product;
    
    //using memory
    // return this.products.find((p) => p.id === id);
  }
  
 
  async createProduct(createProduct: CreateProductDto) {
    //using database
    const existingProduct = await this.productRepository.query(`SELECT * FROM products WHERE name = $1`, [createProduct.name]);
    console.log(existingProduct[0])
    if (existingProduct[0]) {
      throw new ConflictException('Product with this name already exists');
    }
    const { name, description, price, stock } = createProduct;
    const newProduct = await this.productRepository.query(`INSERT INTO products (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *`, [name, description, price, stock]);
    return newProduct;

    //using memory
    // const isProductExists = this.products.some(
    //   (product) => product.name === createProduct.name
    // );
    // if (isProductExists) {
    //     console.log('Product with this name already exists');
    //   throw new ConflictException('Product with this name already exists');
    // }
    // console.log('Creating product:', createProduct);
    // const newProduct: Product = {
    //   id: uuidv4(),
    //   ...createProduct,
    // };

    // this.products.push(newProduct);
    // return createProduct;
  }

  async updateProduct(id: string, updateProductData: UpdateProductDto) {

    //using database
    try{ 
    const columnsWithPlaceholders:string[] = [];
    const values:any[] = [];
    let index = 1;
    console.log('Updating product with ID:', id, 'Data:', updateProductData);

    Object.entries(updateProductData).forEach(([key, value]) => {
      if (value !== undefined) {
        columnsWithPlaceholders.push(`${key} = $${index}`);
        values.push(value);
        index++;
      }
    }
   )

    if (columnsWithPlaceholders.length === 0) {
      throw new Error('No valid fields provided for update.');
    }

    values.push(id);
    const idParamIndex = index;

    const query = `
      UPDATE products
      SET ${columnsWithPlaceholders.join(', ')}
      WHERE id = $${idParamIndex}
      RETURNING *`;
  
    const updatedProduct = await this.productRepository.query(query, values);
    console.log('Updating product:', updatedProduct);
    return updatedProduct[0]; 
  }
    catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
   

    //using memory
    // const index = this.products.findIndex((p) => p.id === id);
    // if (index !== -1) {
    //     console.log('Updating product:', updatedProduct);
    //   this.products[index] = { ...this.products[index], ...updatedProduct };
    //   console.log(this.products)
    //   return this.products[index];
      
    // }
    // throw new Error('Product not found');
  }

  async deleteProduct(id: string) {
     //using database
    try {
       const deletedProduct = await this.productRepository.query(`DELETE FROM products WHERE id = $1 RETURNING *`, [id]);
    if (deletedProduct.length === 0) {
      throw new Error('Product not found');
    }
    return deletedProduct[0];
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
   
   

    //using mermory
    // const index = this.products.findIndex((p) => p.id === id);
    // if (index !== -1) {
    //   const deletedProduct = this.products[index];
    //   this.products.splice(index, 1);
    //   return deletedProduct;
    // }
    // return null;
  }

 async getBulkProducts(ids: (number | string)[]) {
    //using database  
    const query = `SELECT * FROM products WHERE id = ANY($1::uuid[])`;
    const products = await this.productRepository.query(query, [ids]);
    return products;
    
  
 //using memory
    // const products = this.products.filter((product) =>
    //   ids.includes(product.id)
    // );
    // if (products.length === 0) {
    //   throw new Error('No products found for the given IDs');
    // }
    // return products;
  }

}
