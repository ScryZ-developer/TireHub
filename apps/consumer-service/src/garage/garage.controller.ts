import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateGarageVehicleDto } from './dto/create-garage-vehicle.dto';
import { UpdateGarageVehicleDto } from './dto/update-garage-vehicle.dto';
import { GarageService } from './garage.service';

@Controller('garage')
export class GarageController {
  constructor(private readonly garageService: GarageService) {}

  @Get(':userId')
  findAll(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.garageService.findAllByUser(userId);
  }

  @Get(':userId/:id')
  findOne(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.garageService.findOne(userId, id);
  }

  @Post(':userId')
  create(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: CreateGarageVehicleDto,
  ) {
    return this.garageService.create(userId, dto);
  }

  @Patch(':userId/:id')
  update(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGarageVehicleDto,
  ) {
    return this.garageService.update(userId, id, dto);
  }

  @Delete(':userId/:id')
  remove(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.garageService.remove(userId, id);
  }
}
