
import { compare } from 'bcryptjs'; 
import prisma from '~/server/database';


export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { email, password } = body;

    // 1. Vérification basique des entrées
    if (!email || !password) {
      throw createError({
        statusCode: 400, 
        message: 'Veuillez entrer votre email et votre mot de passe.',
      });
    }

    // 2. Chercher l'utilisateur par son email dans la base de données
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

    // 3. Si l'utilisateur n'est PAS trouvé, c'est une erreur d'authentification
    if (!user) {
      throw createError({
        statusCode: 401, 
        message: 'Email ou mot de passe incorrect.',
      });
    }

    // 4. Comparer le mot de passe fourni avec le mot de passe haché de la base de données
    
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw createError({
        statusCode: 401, 
        message: 'Email ou mot de passe incorrect.',
      });
    }

    
    // On prépare les données à renvoyer au client ou a l'employee 
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.UserRole.map(ur => ur.role.name), 
      poste: user.poste,
      department: user.department,
      adresse: user.adresse,
      contacts: user.contacts,
      company: user.company,
      industry: user.industry,
    };

    return {
      statusCode: 200, 
      message: 'Connexion réussie!',
      user: userData,
    };

  } catch (error: any) {
    console.error('Erreur lors de la connexion:', error);
   
  }
});