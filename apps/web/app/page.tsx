import { prismaClient } from "@repo/db/client";

const page = async () => {
  const user = await prismaClient.user.findFirst();
  return (
    <div>
      {user?.email}
      {user?.password}
    </div>
  );
};

export default page;
