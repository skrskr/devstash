import Link from "next/link";
import { prisma } from "@/src/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    return <VerifyResult success={false} message="Missing verification token." />;
  }

  const record = await prisma.verificationToken.findUnique({ where: { token } });

  if (!record) {
    return <VerifyResult success={false} message="Invalid or already used verification link." />;
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return <VerifyResult success={false} message="This verification link has expired. Please register again." />;
  }

  await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({ where: { token } });

  return <VerifyResult success={true} message="Your email has been verified. You can now sign in." />;
}

function VerifyResult({ success, message }: { success: boolean; message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle className="text-2xl">
            {success ? "Email verified" : "Verification failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{message}</p>
          <Link href="/sign-in" className={buttonVariants({ className: "w-full" })}>
            Go to sign in
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
