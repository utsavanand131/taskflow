import type { PrismaClient } from "@/app/generated/prisma/client";
import { OAuth2Client } from "google-auth-library";
import { generateToken } from "@/lib/jwt";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

interface GoogleLoginInput {
  credential: string;
}

export async function googleLogin(
  prisma: PrismaClient,
  input: GoogleLoginInput,
) {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID is not configured.");
  }

  const ticket = await client.verifyIdToken({
    idToken: input.credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload?.email) {
    throw new Error("Invalid Google account.");
  }

  const { email, name, picture, sub: googleId } = payload;

  let oauthAccount = await prisma.oAuthAccount.findUnique({
    where: {
      provider_providerAccountId: {
        provider: "GOOGLE",
        providerAccountId: googleId,
      },
    },
    include: {
      user: true,
    },
  });

  let user = oauthAccount?.user ?? null;

  if (!user) {
    user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name ?? email.split("@")[0],
          image: picture,
          emailVerified: true,
        },
      });
    }

    await prisma.oAuthAccount.create({
      data: {
        provider: "GOOGLE",
        providerAccountId: googleId,
        userId: user.id,
      },
    });
  }

  const token = generateToken(user.id);

  return {
    token,
    user,
  };
}
