'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable('posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      body: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      thumbnail: {
        type: Sequelize.STRING,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('unpublished', 'published', 'draft'),
        defaultValue: 'unpublished',
        allowNull: false
      },
      featured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      tags: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true
      },
      userId: {
        field: 'users_id',
        type: Sequelize.INTEGER,
        allowNull: false
      },
      categoryId: {
        field: 'categories_id',
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
        field: 'created_at'
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        defaultValue: null,
        field: 'updated_at'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.tableExists('posts').then((exists) => {
      if (exists) {
        queryInterface.dropTable('posts')
      }
    })
  }
}
