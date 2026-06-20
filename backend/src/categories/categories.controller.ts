import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard) // Protege tudo!
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Request() req: any, @Body() createCategoryDto: CreateCategoryDto) {
    const userId = req.user.userId;
    return this.categoriesService.create(userId, createCategoryDto);
  }

  @Get()
  findAll(@Request() req: any) {
    const userId = req.user.userId;
    return this.categoriesService.findAll(userId);
  }
}