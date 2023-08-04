const authSelection = {
   id: true,
   email: true,
   name: true,
   gender: true,
   birthday: true,
   role: {
      id: true,
      role: true,
      desc: true,
   },
   avatar: true,
   createdAt: true,
   updatedAt: true,
};

export default authSelection;
