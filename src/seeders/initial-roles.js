module.exports = {
    up: async (queryInterface) => {
        const now = new Date();
      await queryInterface.bulkInsert('roles', [
        { 
            name: 'admin',
            created_at: now,
            updated_at: now
        },
        { 
            name: 'user',
            created_at: now,
            updated_at: now
        },
        { 
            name: 'support',
            created_at: now,
            updated_at: now 
        }
      ], {}); // Ajout de l'option vide pour MySQL 8
    },
    down: async (queryInterface) => {
      await queryInterface.bulkDelete('roles', null, {});
    }
  };
  