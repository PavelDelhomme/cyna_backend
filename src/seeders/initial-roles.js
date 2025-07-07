module.exports = {
    up: async (queryInterface) => {
        const now = new Date();
      await queryInterface.bulkInsert('roles', [
        { 
            name: 'admin',
            createdAt: now,
            updatedAt: now
        },
        { 
            name: 'user',
            createdAt: now,
            updatedAt: now
        },
        { 
            name: 'support',
            createdAt: now,
            updatedAt: now 
        }
      ], {}); // Ajout de l'option vide pour MySQL 8
    },
    down: async (queryInterface) => {
      await queryInterface.bulkDelete('roles', null, {});
    }
  };
  