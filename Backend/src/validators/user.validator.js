import { z } from 'zod';

export const userSignUpSchema = z.object({
  email: z
    .string({
      error: (issue) =>
        issue.input === undefined ? 'Required' : 'Not Valid Email'
    })
    .trim()
    .email(),
  username: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'Required'
          : 'Username must be at least 3 characters long'
    })
    .trim()
    .min(3),
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? 'Required'
          : 'Password must be at least 6 characters long'
    })
    .min(6)
});

export const userSignInSchema = z.object({
    email: z
        .string()
        .trim()
        .email(),
    password: z
        .string()
})