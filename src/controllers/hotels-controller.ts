import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';


export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const hotelId = Number(req.params);
  const hotels = await hotelsService.getHotels(userId, hotelId);
  return res.status(httpStatus.OK).send(hotels);
  
}

