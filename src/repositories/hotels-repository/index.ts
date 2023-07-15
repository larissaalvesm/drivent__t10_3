import { prisma } from '@/config';
import { Hotel } from '@prisma/client';

async function getHotels(): Promise<Hotel[]> {
    return prisma.hotel.findMany();
}

async function getHotelRooms(hotelId: number){
    return  prisma.hotel.findFirst({
        where: {
          id: hotelId,
        },
        include: {
          Rooms: true,
        },
      });
}

const hotelsRepository = { getHotels, getHotelRooms };

export default hotelsRepository;