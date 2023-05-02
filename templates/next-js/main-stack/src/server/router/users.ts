import { prisma } from '@server/prisma'
import { publicProcedure, router } from '@server/trpc'
import { TRPCError } from '@trpc/server'
import { UserCreateOneSchema } from 'prisma/generated/schemas'
import { z } from 'zod'

export const usersRouter = router({

    getAll: publicProcedure
        .query(async () => {

            const users = await prisma.user.findMany()
            
            return users
        }),

    get: publicProcedure
        .input(z.object({
            id: z.number()
        }))
        .query(async ({ input }) => {

            const user = await prisma.user.findUnique({
                where: {
                    id: input.id
                }
            })

            if (!user) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'User not found'
                })
            }

            return user
        }),

    create: publicProcedure
        .input(UserCreateOneSchema)
        .query(async ({ input }) => {

            const user = await prisma.user.create({
                data: input.data
            })

            return user
        }), 

})