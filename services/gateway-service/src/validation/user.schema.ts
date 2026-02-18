import { z } from "@chatapp/common"
export const searchQueryParams = z.object({
      query: z.string().trim().min(3).max(250),
      limit: z
      .union([z.string(), z.number()])
      .optional()
      .transform(value=> value !== undefined ? Number(value): 10)
      .refine(
            (value)=>  Number.isInteger(value) && value >= 3 && value <= 25,
            {message: "Limit must be an interger from 3 to 25"}
      ),
      //array of UUID - one string(starbfoirmed one single element)
      excludeIds:z.union([
            z.array(z.uuid()),
            z
            .uuid()
            .optional()
            .transform(value=>value? [value]: [])
      ])
});

export const userIdParam = z.object({
      id: z.uuid()
});

export const createUserBody = z.object({
      email: z.email(),
      displayName:z.string().min(3).max(255),
})

//{email,displayName}

export type SearchQueryParams = z.infer<typeof searchQueryParams>
export type UserIdParam = z.infer<typeof userIdParam>
export type CreateUserBody = z.infer<typeof createUserBody>
