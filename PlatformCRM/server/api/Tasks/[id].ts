import prisma from "~/server/database";

export default defineEventHandler(async (event) => {
  const taskId = parseInt(event.context.params?.id as string);
  const body = await readBody(event)

  const updated = await prisma.tasks.update({
    where: { id: taskId },
    data: { status: body.status },
  })

  return updated
})
