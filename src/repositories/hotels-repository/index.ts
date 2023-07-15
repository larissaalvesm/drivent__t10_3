import { prisma } from '@/config';
import { Hotel } from '@prisma/client';

async function getHotels(): Promise<Hotel[]> {
  const hotels =  prisma.hotel.findMany();
  return hotels;
}

async function getHotelRooms(hotelId: number) {
  const hotel = prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    },
  });

  console.log(hotel);
  return hotel;
}

const hotelsRepository = { getHotels, getHotelRooms };

export default hotelsRepository;