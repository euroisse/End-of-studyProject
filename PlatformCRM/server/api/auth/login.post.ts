import { hash, compare } from 'bcryptjs';
import prisma from '~/server/database';

export default defineEventHandler(async (event) => {
    
        const body = await readBody(event);
        const { email, password, roleId } = body;

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                UserRole: {
                    include: {
                        role: true,
                    },
                },
            },
        });

        // Si l'user n'existe pas renvoie l'erreur
        if (!user) {
            throw createError({
                statusCode: 404,
                message: 'Utilisateur non trouvé',
            });
        }
        else{
          //else
          //compare le mot de passe hacher avec celle de la bd
          const passwordMatch = await compare(password, user.password)
          console.log('mot de passe comparé', passwordMatch)
          if (!passwordMatch) {
              throw createError({
                  statusCode: 401,
                  message: ' Mot de passe incorrect',
              }); 
          }
        }
      
        // const userHasRole = user.UserRole.some(ur => ur.roleId === parseInt(roleId));

        // if (!userHasRole) {
        //     return createError({
        //         statusCode: 403,
        //         message: 'Type d\'utilisateur incorrect',
        //     });
        // }

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                roles: user.UserRole.map(ur => ur.role.name),
                poste: user.poste ?? null, 
                department: user.department ?? null,
                adresse: user.adresse ?? null,
                company: user.company ?? null,
                industry: user.industry ?? null,
            },
        };
     } )