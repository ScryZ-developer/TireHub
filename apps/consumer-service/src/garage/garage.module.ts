import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GarageController } from './garage.controller';
import { GarageVehicle } from './garage.entity';
import { GarageService } from './garage.service';

@Module({
  imports: [TypeOrmModule.forFeature([GarageVehicle])],
  controllers: [GarageController],
  providers: [GarageService],
})
export class GarageModule {}
