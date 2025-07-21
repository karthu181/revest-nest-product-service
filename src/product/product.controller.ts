import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.model';
import { CreateProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll() {
     return await this.productService.getAllProducts();

    
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string) {
    return await this.productService.getProductById(Number(id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() createProduct: CreateProductDto) {
    return await this.productService.createProduct(createProduct);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Param('id') id: string,
    @Body() updatedProduct: UpdateProductDto,
  ) {
    return await this.productService.updateProduct(id, updatedProduct);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    await this.productService.deleteProduct(id);
    return { message: 'Product deleted successfully' };
  }

@Post('bulk')
@HttpCode(HttpStatus.OK)
async getBulkProducts(@Body('ids') ids: number[] | string[]) {
  console.log("type", typeof ids);
  return await this.productService.getBulkProducts(ids); 
}

}
