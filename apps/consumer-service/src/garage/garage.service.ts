import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGarageVehicleDto } from './dto/create-garage-vehicle.dto';
import { UpdateGarageVehicleDto } from './dto/update-garage-vehicle.dto';
import { GarageVehicle } from './garage.entity';

@Injectable()
export class GarageService {
  constructor(
    @InjectRepository(GarageVehicle)
    private readonly garageRepository: Repository<GarageVehicle>,
  ) {}

  async findAllByUser(userId: string): Promise<GarageVehicle[]> {
    return this.garageRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<GarageVehicle> {
    const vehicle = await this.garageRepository.findOne({
      where: { id, userId },
    });

    if (!vehicle) {
      throw new NotFoundException(`Garage vehicle ${id} not found`);
    }

    return vehicle;
  }

  async create(userId: string, dto: CreateGarageVehicleDto): Promise<GarageVehicle> {
    const vehicle = this.garageRepository.create({
      userId,
      ...dto,
    });

    return this.garageRepository.save(vehicle);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateGarageVehicleDto,
  ): Promise<GarageVehicle> {
    const vehicle = await this.findOne(userId, id);
    Object.assign(vehicle, dto);
    return this.garageRepository.save(vehicle);
  }

  async remove(userId: string, id: string): Promise<void> {
    const vehicle = await this.findOne(userId, id);
    await this.garageRepository.remove(vehicle);
  }
}
