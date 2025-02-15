import s3Client from "src/lib/s3";
import s3 from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const objectKey = request.nextUrl.searchParams.get("objectKey");

  console.log(objectKey);

  if (!objectKey) {
    return NextResponse.json(
      { error: "objectKey is required" },
      { status: 400 }
    );
  }

  const command = new s3.PutObjectCommand({
    Bucket: process.env.RGB_SPLITTING_BUCKET_NAME!,
    Key: objectKey,
  });

  try {
    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    return NextResponse.json({ presignedUrl: url });
  } catch (er) {
    console.log("err", er);
  }
}
