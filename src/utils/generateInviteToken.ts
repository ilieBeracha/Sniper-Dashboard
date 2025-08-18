export const generateInviteToken = () => {
  const token = crypto.randomUUID();
  return token;
};
