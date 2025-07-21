import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from 'src/db/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/db/entities/product.entity';

@Module({
  // Sets up global DB connection
  // Registers entity for current module
  imports: [ TypeOrmModule.forFeature([Product]),],
  providers: [ProductService,],
  controllers: [ProductController],
})
export class ProductModule {}
