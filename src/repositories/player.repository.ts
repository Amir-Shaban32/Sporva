import { prisma } from '../lib/prisma';
import { Prisma , Positions} from '../../generated/prisma';

export class PlayerRepository {

    async findByName(name:{f_name?:string , l_name?:string}){
        return await prisma.players.findMany({
            where:{first_name:name.f_name , last_name:name.l_name},
        });
    }

    async findByTeam(teamId:string){
        return await prisma.players.findMany({
            where:{team_id:teamId},
        });
    }

    async findByPosition(position:string){
        return await prisma.players.findMany({
            where:{position:position as Positions},
        });
    }

    async findByNationality(nationality: string){
        return await prisma.players.findMany({
            where:{nationality},
        });
    }
}

export const playerRepository = new PlayerRepository();