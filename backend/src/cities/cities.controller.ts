import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { CitiesService } from './cities.service';

@ApiTags('Cities')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List all cities' })
  listCities() {
    return this.citiesService.listCities();
  }

  @Post()
  @ApiOperation({ summary: 'Find or create a city by name' })
  findOrCreate(@Body() dto: { name: string }) {
    return this.citiesService.findOrCreateCity(dto.name);
  }
}
