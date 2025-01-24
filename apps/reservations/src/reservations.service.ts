import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { PAYMENTS_SERVICE, User } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map } from 'rxjs';
import { Reservation } from './models/reservation.entity';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy
  ) { }

  async create(createReservationDto: CreateReservationDto, { email, id: userId }: User) {
    return this.paymentsService.send("create_charge", {
      ...createReservationDto.charge,
      email
    })
      .pipe(
        map(
          async (res) => {
            const reservation = new Reservation({
              ...createReservationDto,
              invoiceId: res.id,
              timestamp: new Date(),
              userId: userId
            })
            return this.reservationRepository.create(reservation);
          }
        )
      )
  }

  async findAll() {
    return this.reservationRepository.find({});
  }

  async findOne(id: number) {
    return this.reservationRepository.findOne({ id: id })
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate(
      { id: id },
      updateReservationDto
    )
  }

  async remove(id: number) {
    return this.reservationRepository.findOneAndDelete({ id: id })
  }
}
