import { hash } from 'bcryptjs';
import prisma from '~/server/database'; 

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const { nom, email, password, adresse, contact } = body;

        // Vérifier si toutes les informations nécessaires sont présentes
        if (!nom || !email || !password) {
            throw createError({
                statusCode: 400,
                message: 'Veuillez fournir le nom, l\'email et le mot de passe.',
            });
        }

        // 1. Rechercher l'ID du rôle "customer"
        const customerRole = await prisma.role.findUnique({
            where: { name: 'customer' },
        });

        if (!customerRole) {
            
            throw createError({
                statusCode: 500,
                message: 'Le rôle "customer" est introuvable. Veuillez contacter l\'administrateur.',
            });
        }

        // 2. Hacher le mot de passe pour la sécurité
        const hashedPassword = await hash(password, 10); 

        // 3. Créer l'utilisateur et l'associer au rôle "customer"
        const newUser = await prisma.user.create({
            data: {
                name: nom,
                email,
                password: hashedPassword,
                adresse: adresse || null, 
                contacts: contact || null, 
                UserRole: {
                    create: {
                        roleId: customerRole.id, 
                    },
                },
            },

            include: {
                UserRole: {
                    include: {
                        role: true,
                    },
                },
            },
        });

        // Retourner les informations du nouvel utilisateur (sans le mot de passe haché)
        return {
            statusCode: 201, 
            message: 'Utilisateur client créé avec succès !',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                adresse: newUser.adresse,
                contacts: newUser.contacts,
                roles: newUser.UserRole.map(ur => ur.role.name),
            },
        };

    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur client:', error);

    }
});