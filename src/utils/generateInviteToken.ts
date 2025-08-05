export const generateInviteToken = () => {
  const token = crypto.randomUUID();
  console.log("token", token);
  return token;
};
