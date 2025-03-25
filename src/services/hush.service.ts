import crypto from 'crypto';

// Function to decrypt the ciphertext
export function decrypt(encryptedData: string, secretKey: string, iv: string, authTag: string): string {
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(secretKey, 'utf-8'), Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}


