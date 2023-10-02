import bcrypt from 'bcryptjs';

export const encryptPassword = async (password) => {
  const encryptedPassword = await bcrypt.hash(password, 8);
  return encryptedPassword;
};

console.log(await encryptPassword('password'))