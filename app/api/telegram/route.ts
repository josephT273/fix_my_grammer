import { type NextRequest, NextResponse } from "next/server";
import bot from "@/utils/bot";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.text();

    console.log("Webhook received: ", {
      bodyLength: body.length,
      timestamp: new Date().toISOString(),
    });

    const update = JSON.parse(body);
    await bot.handleUpdate(update);
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      bot: "counseling-bot",
    });
  } catch (error) {
    console.log(error);
  }
};

export const GET = async () => {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    bot: "counseling-bot",
  });
};
