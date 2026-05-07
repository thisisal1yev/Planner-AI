import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { CategoriesService } from './categories.service';

@ApiTags('Categories')
@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('event-categories')
  @Public()
  @ApiOperation({ summary: 'List all event categories' })
  listEventCategories() {
    return this.categoriesService.listEventCategories();
  }

  @Get('service-categories')
  @Public()
  @ApiOperation({ summary: 'List all service categories' })
  listServiceCategories() {
    return this.categoriesService.listServiceCategories();
  }

  @Get('venue-categories')
  @Public()
  @ApiOperation({ summary: 'List all venue categories' })
  listVenueCategories() {
    return this.categoriesService.listVenueCategories();
  }

  @Post('event-categories')
  @ApiOperation({ summary: 'Find or create an event category' })
  createEventCategory(@Body() dto: { name: string }) {
    return this.categoriesService.findOrCreateEventCategory(dto.name);
  }

  @Post('service-categories')
  @ApiOperation({ summary: 'Find or create a service category' })
  createServiceCategory(@Body() dto: { name: string }) {
    return this.categoriesService.findOrCreateServiceCategory(dto.name);
  }

  @Post('venue-categories')
  @ApiOperation({ summary: 'Find or create a venue category' })
  createVenueCategory(@Body() dto: { name: string }) {
    return this.categoriesService.findOrCreateVenueCategory(dto.name);
  }
}
