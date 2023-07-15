
import { notFoundError, paymentRequiredError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import hotelsRepository from '@/repositories/hotels-repository';

async function getHotels(userId: number, hotelId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();
  
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();

    const ticketType = await ticketsRepository.findTicketTypeById(ticket.ticketTypeId);
    if(ticket.status !== 'PAID' || ticketType.isRemote === true || ticketType.includesHotel === false) throw paymentRequiredError();

    if(hotelId){
    const hotelRooms = await hotelsRepository.getHotelRooms(hotelId);

    if(!hotelRooms) throw notFoundError();

    return hotelRooms;

    } else{
    const hotels = await hotelsRepository.getHotels();

    if(hotels.length === 0) throw notFoundError();
  
    return hotels;
    }

  }

const hotelsService = { getHotels };

export default hotelsService;