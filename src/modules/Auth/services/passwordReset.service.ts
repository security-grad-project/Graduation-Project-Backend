import bcrypt from 'bcrypt';
import { prisma } from '../../../config/postgres';
import { sendEmail } from '../../../common/services/email.service';
import logger from '../../../common/utils/logger';
import { generateSecureToken, hashToken } from './token.service';

const TOKEN_EXPIRY_MS = 60 * 60 * 1000;

export const requestPasswordReset = async (email: string) => {
  try {
    const analyst = await prisma.analyst.findUnique({
      where: { email },
    });

    if (!analyst) {
      return true;
    }

    const token = generateSecureToken();
    const hashedToken = hashToken(token);
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);

    await prisma.passwordResetToken.create({
      data: {
        token: hashedToken,
        analystId: analyst.id,
        expiresAt,
      },
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const subject = 'Password Reset Request';
    const html = `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset for your account.</p>
      <p>Please click the link below to reset your password. This link is valid for 1 hour.</p>
      <a href="${resetLink}">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await sendEmail(email, subject, html);

    return true;
  } catch (error) {
    logger.error('Error requesting password reset:', error);
    throw new Error('Failed to request password reset');
  }
};

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const hashedToken = hashToken(token);

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new Error('Invalid or expired password reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction([
      prisma.analyst.update({
        where: { id: resetToken.analystId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.deleteMany({
        where: { analystId: resetToken.analystId },
      }),
    ]);

    return true;
  } catch (error) {
    logger.error('Error resetting password:', error);
    throw error;
  }
};
