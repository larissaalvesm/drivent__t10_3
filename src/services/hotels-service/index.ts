
import { notFoundError, paymentRequiredError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import hotelsRepository from '@/repositories/hotels-repository';

async function getHotels(userId: number) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();
  
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();

    const ticketType = await ticketsRepository.findTicketTypeById(ticket.ticketTypeId);
    if(ticket.status !== 'PAID' || ticketType.isRemote === true || ticketType.includesHotel === false) throw paymentRequiredError();

    const hotels = await hotelsRepository.getHotels();

    if(hotels.length === 0) throw notFoundError();
  
    return hotels;
  }

async function getHotelById(userId: number, hotelId: any) {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) throw notFoundError();
  
    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) throw notFoundError();

    const ticketType = await ticketsRepository.findTicketTypeById(ticket.ticketTypeId);
    if(ticket.status !== 'PAID' || ticketType.isRemote === true || ticketType.includesHotel === false) throw paymentRequiredError();

    const hotelRooms = await hotelsRepository.getHotelRooms(hotelId);

    if(!hotelRooms) throw notFoundError();

    return hotelRooms;
  }

const hotelsService = { getHotels, getHotelById };

export default hotelsService;