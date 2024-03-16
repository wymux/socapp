import { NextResponse, NextRequest } from "next/server";
import prisma from "@/app/prismadb";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export async function POST(request: NextRequest, response: NextResponse) {
  const Session = await getServerSession(options);

  if (!Session) {
    return NextResponse.json("unAuthorized User ...");
  }

  if (!Session?.user?.email) {
    return;
  }

  const UserExist = await prisma.user.findUnique({
    where: {
      email: Session.user.email,
    },
  });

  if (!UserExist) {
    return NextResponse.json("Usr does not exist");
  }

  try {
    const body = await request.json();

    const { PostId, commentId } = body;

    const existingPost = await prisma.post.findUnique({
      where: {
        id: PostId,
      },
    });

    if (!existingPost) {
      return NextResponse.json("No post found with provided postId");
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        postId: existingPost.id,
        userId: UserExist.id,
        commentId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      return NextResponse.json("Unliked Comment");
    } else {
      const newLike = await prisma.like.create({
        data: {
          userId: UserExist.id,
          postId: existingPost.id,
          commentId,
        },
      });

      return NextResponse.json("Liked the Comment");
    }
  } catch (error) {
    console.log("Error liking the post", error);
    return NextResponse.error();
  }
}
