import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';


export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotels = await hotelsService.getHotels(userId);
  return res.status(httpStatus.OK).send(hotels);
}

export async function getHotelById(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { hotelIdReceived } = req.params;
  const hotelId = parseInt(hotelIdReceived);
  // if (isNaN(hotelId) || hotelId <= 0) return res.sendStatus(httpStatus.BAD_REQUEST);
  const hotel = await hotelsService.getHotelById(userId, hotelId);

  return res.status(httpStatus.OK).send(hotel);
}

