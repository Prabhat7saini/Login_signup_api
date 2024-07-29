const { DataTypes,Op } = require('sequelize');
const sequelize = require('../config/database');
const cron = require('node-cron');
const Otp = sequelize.define(
  'Otp',
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    expiresAt: {
      type: DataTypes.VIRTUAL,
      get() {
        return new Date(new Date(this.createdAt).getTime() + 5 * 60 * 1000);
      }
    }
  },
  {
    tableName: 'otps',
    timestamps: false
  }
);

Otp.prototype.isExpired = function() {
  return new Date() > this.expiresAt;
};


Otp.prototype.isExpired = function() {
  return new Date() > this.expiresAt;
};

// Add static method to delete expired OTPs
Otp.deleteExpired = async function() {
  const now = new Date();
  await Otp.destroy({
    where: {
      createdAt: {
        [Op.lt]: new Date(now.getTime() - 5 * 60 * 1000) // 5 minutes before current time
      }
    }
  });
};

// Initialize cron job for periodic cleanup
cron.schedule('*/2 * * * *', async () => {
  try {
    await Otp.deleteExpired();
    console.log('Expired OTPs cleaned up');
  } catch (error) {
    console.error('Error cleaning up expired OTPs:', error);
  }
});

// Sync the database and start the cron job
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established.');
    await sequelize.sync(); // Ensure the OTP table is created
    console.log('Database synced.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = Otp;
